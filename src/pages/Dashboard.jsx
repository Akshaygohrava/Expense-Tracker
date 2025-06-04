const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-xl font-bold text-blue-600">₹0.00</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-gray-500">No recent data</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Monthly Overview</h3>
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// This is a simple Dashboard component 