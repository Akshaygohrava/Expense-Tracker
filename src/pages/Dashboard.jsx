import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../components/Firebase';
import Chart from '../components/Charts';
import Papa from 'papaparse';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({});
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');

  const [budget, setBudget] = useState('');
  const [showBudgetInput, setShowBudgetInput] = useState(false);

  // ✅ Real-time expense sync
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        amount: parseFloat(doc.data().amount),
      }));
      setExpenses(data);
      localStorage.setItem('expenses', JSON.stringify(data));
    }, (error) => {
      console.error('Failed to listen to expenses:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Budget Fetch (unchanged)
  useEffect(() => {
    const fetchBudget = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'budgets', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBudget(Number(docSnap.data().monthlyBudget));
          localStorage.setItem('monthlyBudget', docSnap.data().monthlyBudget);
        } else {
          const localBudget = localStorage.getItem('monthlyBudget');
          if (localBudget) setBudget(Number(localBudget));
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
      }
    };

    fetchBudget();
  }, [user]);

  // Filters & Sorting
  useEffect(() => {
    let filtered = [...expenses];

    if (month) {
      filtered = filtered.filter(exp => exp.date?.slice(5, 7) === month);
    }
    if (year) {
      filtered = filtered.filter(exp => exp.date?.slice(0, 4) === year);
    }
    if (category) {
      filtered = filtered.filter(exp => exp.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(exp => exp.title?.toLowerCase().includes(search.toLowerCase()));
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

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setEditedExpense({ ...exp });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedExpense({});
  };

  const handleSaveEdit = async () => {
    try {
      const expenseRef = doc(db, 'expenses', editedExpense.id);
      await updateDoc(expenseRef, editedExpense);

      setEditingId(null);
      setEditedExpense({});
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Failed to save changes.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteDoc(doc(db, 'expenses', id));
      alert('✅ Expense deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('❌ Failed to delete expense.');
    }
  };

  const handleSaveBudget = async () => {
    try {
      if (!user) return;

      const budgetRef = doc(db, 'budgets', user.uid);
      await setDoc(budgetRef, { monthlyBudget: budget });

      localStorage.setItem('monthlyBudget', budget);
      alert('✅ Budget saved!');
      setShowBudgetInput(false);
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('❌ Failed to save budget.');
    }
  };

  const totalMonthlySpending = filteredExpenses.reduce(
    (sum, exp) => sum + (isNaN(Number(exp.amount)) ? 0 : Number(exp.amount)),
    0
  );
  const budgetExceeded = Number(budget) > 0 && totalMonthlySpending > Number(budget);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Budget Warning */}
      <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded">
        <div className="flex justify-between items-center">
          <div>
            Monthly Budget:{' '}
            {showBudgetInput ? (
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="border p-1 rounded"
              />
            ) : (
              <strong>₹{budget || 'Not Set'}</strong>
            )}
            {budgetExceeded && (
              <div className="text-red-600 mt-1 font-semibold">
                ⚠️ You have exceeded your monthly budget!
              </div>
            )}
          </div>
          <div>
            {showBudgetInput ? (
              <button onClick={handleSaveBudget} className="bg-blue-500 text-white px-3 py-1 rounded ml-2">
                Save
              </button>
            ) : (
              <button onClick={() => setShowBudgetInput(true)} className="bg-gray-500 text-white px-3 py-1 rounded">
                Edit Budget
              </button>
            )}
          </div>
        </div>
      </div>

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

      {/* CSV Export */}
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
            {editingId === exp.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedExpense.title}
                  onChange={(e) => setEditedExpense({ ...editedExpense, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editedExpense.amount}
                  onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  value={editedExpense.date}
                  onChange={(e) => setEditedExpense({ ...editedExpense, date: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={editedExpense.category}
                  onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{exp.title}</div>
                  <div className="text-sm text-gray-500">{exp.date} • {exp.category}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-right">₹{exp.amount}</span>
                  <button
                    onClick={() => handleEditClick(exp)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            )}
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
