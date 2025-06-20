import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase'; // Capital F

const ExpenseForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const submitHandler = (data) => {
    const isRecurring = data.recurring === true || data.recurring === 'on';
    const sharedEmails = data.sharedWith
      ? data.sharedWith
          .split(',')
          .map(email => email.trim().toLowerCase())
          .filter(email => email)
      : [];

    // Include current user's email if not already
    if (currentUser && !sharedEmails.includes(currentUser.email)) {
      sharedEmails.push(currentUser.email);
    }

    // Compute split amounts
    const totalAmount = parseFloat(data.amount);
    const numPeople = sharedEmails.length || 1;
    const share = +(totalAmount / numPeople).toFixed(2);
    const remaining = +(totalAmount - share * (numPeople - 1)).toFixed(2);

    // Create splitAmount map
    const splitAmount = {};
    sharedEmails.forEach((email, idx) => {
      splitAmount[email] = idx === 0 ? remaining : share;
    });

    const expenseData = {
      ...data,
      amount: totalAmount,
      recurring: isRecurring,
      sharedWith: sharedEmails,
      splitAmount,
    };

    onSubmit(expenseData);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6 sm:mt-10"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-4">
        Add Expense
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            {...register('title', { required: true })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Groceries"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: true })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            {...register('date', { required: true })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            {...register('category')}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Food, Transport"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Note</label>
        <textarea
          {...register('note')}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Optional note..."
        />
      </div>

      {/* ✅ Recurring checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('recurring')}
          className="mr-2"
        />
        <label className="text-sm font-medium">
          Recurring Monthly Expense?
        </label>
      </div>

      {/* ✅ Shared With Emails */}
      <div>
        <label className="block mb-1 font-medium">Shared With (Emails)</label>
        <input
          type="text"
          {...register('sharedWith')}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. friend@example.com, roommate@example.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple emails with commas.
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
