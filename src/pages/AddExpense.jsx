import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../components/Firebase';
import ExpenseForm from '../components/ExpenseForm';

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

  if (loadingAuth) return <div className="text-center mt-8 text-blue-500">Loading user...</div>;
  if (!user) return <div className="text-center mt-8 text-red-500">Please log in to add expenses.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Expense</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ExpenseForm onSubmit={handleAddExpense} loading={submitting} />
      </div>
    </div>
  );
};

export default AddExpense;
