import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Charts = ({ expenses }) => {
  // Group by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  // Line chart: group by date
  const dateTotals = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const dates = Object.keys(dateTotals).sort();
  const dailyAmounts = dates.map(date => dateTotals[date]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Expenses by Category (Donut)</h3>
        <Doughnut
          data={{
            labels: categories,
            datasets: [{
              data: amounts,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
            }],
          }}
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Expenses Over Time (Line)</h3>
        <Line
          data={{
            labels: dates,
            datasets: [{
              label: '₹ Amount',
              data: dailyAmounts,
              fill: false,
              borderColor: '#3b82f6',
              tension: 0.3,
            }],
          }}
        />
      </div>

      <div className="bg-white p-4 rounded shadow md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Category Breakdown (Bar)</h3>
        <Bar
          data={{
            labels: categories,
            datasets: [{
              label: '₹ Amount',
              data: amounts,
              backgroundColor: '#10b981',
            }],
          }}
        />
      </div>
    </div>
  );
};

export default Charts;
