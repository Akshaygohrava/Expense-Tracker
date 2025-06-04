import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';

const AddExpense = () => {
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    console.log('New Expense:', newExpense);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Expense</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ExpenseForm onSubmit={handleAddExpense} />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Preview Expenses</h3>
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="bg-gray-100 p-3 rounded shadow-sm flex justify-between items-center"
            >
              <span className="font-medium">{exp.title}</span>
              <span className="text-sm text-gray-600">
                ₹{exp.amount} on {exp.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddExpense;
