import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetChart({ budgets, transactions }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();



  const data = ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'].map(category => {
    // Find budget for current month
    const budget = budgets.find(b => {
      const budgetDate = new Date(b.month);
      return (
        b.category === category &&
        budgetDate.getMonth() === currentMonth &&
        budgetDate.getFullYear() === currentYear
      );
    })?.amount || 0;

    // Calculate actual spending
    const actual = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          t.category === category &&
          tDate.getMonth() === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    

    return {
      category,
      budget,
      actual
    };
  });

  return (
    <div className="w-full h-80 mt-4">
      <h3 className="text-lg font-medium mb-2">Budget vs Actual</h3>
      
      

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Amount']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="budget" 
            fill="#8884d8" 
            name="Budget" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="actual" 
            fill="#82ca9d" 
            name="Actual" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}