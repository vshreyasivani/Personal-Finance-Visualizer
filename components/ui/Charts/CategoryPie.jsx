import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function CategoryPieChart({ transactions }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const data = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="w-full h-80 mt-4">
      <h3 className="text-lg font-medium mb-2">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, undefined]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}