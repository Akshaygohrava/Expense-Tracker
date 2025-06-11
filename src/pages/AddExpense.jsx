import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../components/Firebase';
import ExpenseForm from '../components/ExpenseForm';
import Papa from 'papaparse';

const AddExpense = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [submitting, setSubmitting] = useState(false);

  const handleAddExpense = async (expense) => {
    if (!user) {
      alert("You must be logged in to add expenses.");
      return;
    }

    const newExpense = {
      ...expense,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    };

    try {
      setSubmitting(true);
      await addDoc(collection(db, 'expenses'), newExpense);
      alert("✅ Expense added successfully!");
    } catch (err) {
      console.error('Error saving expense:', err);
      alert("❌ Failed to add expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const rows = results.data;

        const expensesToAdd = rows.map(row => ({
          title: row.title || 'Untitled',
          amount: parseFloat(row.amount) || 0,
          date: row.date || new Date().toISOString().slice(0, 10),
          category: row.category || 'Uncategorized',
          createdAt: new Date().toISOString(),
          userId: user.uid,
        }));

        try {
          setSubmitting(true);
          const promises = expensesToAdd.map(exp =>
            addDoc(collection(db, 'expenses'), exp)
          );
          await Promise.all(promises);
          alert('✅ CSV imported successfully!');
        } catch (error) {
          console.error('CSV import failed:', error);
          alert('❌ Failed to import CSV.');
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  if (loadingAuth) return <div className="text-center mt-8 text-blue-500">Loading user...</div>;
  if (!user) return <div className="text-center mt-8 text-red-500">Please log in to add expenses.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Expense</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <ExpenseForm onSubmit={handleAddExpense} loading={submitting} />

        {/* CSV Import Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">📥 Import Expenses from CSV</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="block border border-gray-300 p-2 rounded w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Ensure CSV contains headers: <code>title, amount, date, category</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
