import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../components/Firebase';
import Chart from '../components/Charts';
import Papa from 'papaparse';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Load from localStorage initially
  useEffect(() => {
    const localData = localStorage.getItem('expenses');
    if (localData) {
      setExpenses(JSON.parse(localData));
    }
  }, []);

  // Fetch from Firestore
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(data);
        localStorage.setItem('expenses', JSON.stringify(data)); // ✅ Sync to localStorage
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };

    fetchExpenses();
  }, [user]);

  // Filtering, searching, sorting
  useEffect(() => {
    let filtered = [...expenses];

    if (month) {
      filtered = filtered.filter(exp => exp.date?.slice(5, 7) === month);
    }

    if (year) {
      filtered = filtered.filter(exp => exp.date?.slice(0, 4) === year);
    }

    if (category) {
      filtered = filtered.filter(exp =>
        exp.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter(exp =>
        exp.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOption === 'amount-asc') {
      filtered.sort((a, b) => a.amount - b.amount);
    } else if (sortOption === 'amount-desc') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === 'date-desc') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredExpenses(filtered);
  }, [expenses, month, year, category, search, sortOption]);

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredExpenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <select onChange={(e) => setMonth(e.target.value)} value={month} className="p-2 border rounded">
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <select onChange={(e) => setYear(e.target.value)} value={year} className="p-2 border rounded">
          <option value="">All Years</option>
          {[...new Set(expenses.map(exp => exp.date?.slice(0, 4)))].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Search & Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          onChange={(e) => setSortOption(e.target.value)}
          value={sortOption}
          className="p-2 border rounded"
        >
          <option value="">Sort By</option>
          <option value="amount-asc">Amount ↑</option>
          <option value="amount-desc">Amount ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="date-desc">Date ↓</option>
        </select>
      </div>

      {/* CSV Export Button */}
      <div className="mb-4 text-right">
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Expenses List */}
      <ul className="space-y-2 mb-8">
        {filteredExpenses.map(exp => (
          <li key={exp.id} className="bg-white shadow rounded p-4">
            <div className="flex justify-between">
              <span className="font-medium">{exp.title}</span>
              <span>₹{exp.amount}</span>
            </div>
            <div className="text-sm text-gray-500">{exp.date} • {exp.category}</div>
          </li>
        ))}
      </ul>

      {/* Charts */}
      <div className="mb-6">
        <Chart expenses={filteredExpenses} />
      </div>
    </div>
  );
};

export default Dashboard;
