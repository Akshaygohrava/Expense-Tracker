import { useForm } from 'react-hook-form';

const ExpenseForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  const submitHandler = (data) => {
    onSubmit(data);
    reset(); // Clear form after submission
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto"
    >
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...register('title', { required: true })}
          className="w-full border p-2 rounded"
          placeholder="e.g. Groceries"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { required: true })}
          className="w-full border p-2 rounded"
          placeholder="e.g. 500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          {...register('date', { required: true })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          {...register('category')}
          className="w-full border p-2 rounded"
          placeholder="e.g. Food, Transport"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Note</label>
        <textarea
          {...register('note')}
          className="w-full border p-2 rounded"
          rows={2}
          placeholder="Optional note..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;