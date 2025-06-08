import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../components/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const AddExpense = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await addDoc(collection(db, 'expenses'), newExpense);
      console.log('Expense saved to Firestore:', newExpense);
      alert("Expense added!");
    } catch (err) {
      console.error('Error saving expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Expense</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ExpenseForm onSubmit={handleAddExpense} loading={loading} />
      </div>
    </div>
  );
};

export default AddExpense;
