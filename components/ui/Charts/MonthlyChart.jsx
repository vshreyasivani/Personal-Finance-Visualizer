import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend 
  } from 'recharts';
  
  export default function MonthlyChart({ transactions }) {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Prepare data for chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize data array with all months
    const monthlyData = monthNames.map((name, index) => ({
      name,
      month: index,
      expenses: 0,
      income: 0
    }));
    
    // Populate with transaction data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      // Only include current year's transactions
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        if (transaction.type === 'expense') {
          monthlyData[month].expenses += transaction.amount;
        } else {
          monthlyData[month].income += transaction.amount;
        }
      }
    });
  
    return (
      <div className="w-full h-80 mt-4">
        <h3 className="text-lg font-medium mb-2">Monthly Overview ({currentYear})</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
              labelFormatter={(label) => `${label} ${currentYear}`}
            />
            <Legend />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#ef4444" 
            />
            <Bar 
              dataKey="income" 
              name="Income" 
              fill="#22c55e" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }