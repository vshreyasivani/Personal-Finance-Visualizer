import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Car, Utensils, Home, Tv, Zap, Circle } from 'lucide-react';

export default function DashboardCards({ transactions, budgets }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Category data
  const categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'];
  
  // Calculate category expenses
  const categoryExpenses = categories.map(category => ({
    name: category,
    amount: transactions
      .filter(t => 
        t.category === category && 
        t.type === 'expense' && 
        new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    icon: {
      'Food': <Utensils className="h-4 w-4" />,
      'Transport': <Car className="h-4 w-4" />,
      'Housing': <Home className="h-4 w-4" />,
      'Entertainment': <Tv className="h-4 w-4" />,
      'Utilities': <Zap className="h-4 w-4" />,
      'Other': <Circle className="h-4 w-4" />
    }[category],
    color: {
      'Food': 'bg-red-500',
      'Transport': 'bg-blue-500',
      'Housing': 'bg-yellow-500',
      'Entertainment': 'bg-purple-500',
      'Utilities': 'bg-green-500',
      'Other': 'bg-gray-500'
    }[category]
  }));

  const totalExpenses = categoryExpenses.reduce((sum, cat) => sum + cat.amount, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Recent transactions (last 3)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {/* Enhanced Monthly Expenses Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Monthly Expenses</span>
            <span className="text-lg font-bold">${totalExpenses.toFixed(2)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryExpenses
              .filter(cat => cat.amount > 0)
              .sort((a, b) => b.amount - a.amount)
              .map(category => {
                const percentage = (category.amount / totalExpenses) * 100;
                
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </span>
                      <span>${category.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${category.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {totalIncome > 0 ? `${((totalExpenses/totalIncome)*100).toFixed(1)}% of income` : ''}
          </p>
        </CardFooter>
      </Card>

      {/* Budget Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.filter(b => new Date(b.month).getMonth() === currentMonth).map(budget => {
            const spent = transactions
              .filter(t => t.category === budget.category && t.type === 'expense')
              .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const percent = Math.min((spent / budget.amount) * 100, 100);
            const progressColor = percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-yellow-500' : 'bg-green-500';
            
            return (
              <div key={budget._id} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{budget.category}</span>
                  <span>${spent.toFixed(2)} of ${budget.amount.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${progressColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map(t => {
              const category = categoryExpenses.find(c => c.name === t.category);
              return (
                <div key={t._id} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 ${category?.color || 'bg-gray-500'} p-2 rounded-full`}>
                    {category?.icon || <Circle className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`ml-auto font-medium ${
                    t.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button variant="outline" size="sm" className="w-full">
            View All Transactions
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}