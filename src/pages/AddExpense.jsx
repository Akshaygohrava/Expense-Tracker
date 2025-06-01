import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';

const AddExpense = () => {
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(), // Unique ID
    };
    setExpenses((prev) => [...prev, newExpense]);
    console.log('New Expense:', newExpense);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
      <ExpenseForm onSubmit={handleAddExpense} />

      {/* Preview List (temporary) */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Preview Expenses:</h3>
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <li key={exp.id} className="bg-gray-200 p-2 rounded">
              {exp.title} - ₹{exp.amount} on {exp.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddExpense;
