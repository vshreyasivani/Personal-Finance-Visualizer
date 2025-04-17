'use client';

import { useState, useEffect } from 'react';
import TransactionForm from '@/components/ui/TransactionForm';
import TransactionList from '@/components/ui/TransactionList';
import MonthlyChart from '@/components/ui/Charts/MonthlyChart';
import CategoryPieChart from '@/components/ui/Charts/CategoryPie';
import BudgetChart from '@/components/ui/Charts/BudgetChart';
import BudgetForm from '@/components/ui/BudgetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import DashboardCards from '@/components/ui/DashboardCards';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: string;
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

type TransactionFormData = {
  _id?: string;
  amount: string | number;
  category: string;
  date: string;
  description: string;
  type: string;
};

type BudgetFormData = {
  category: string;
  amount: number;
  month: string;
};

type TabValue = 'dashboard' | 'transactions' | 'add' | 'budgets';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        const transactionsRes = await fetch('/api/transactions');
        if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
        const transactionsData: Transaction[] = await transactionsRes.json();
        
        const budgetsRes = await fetch('/api/budgets');
        if (!budgetsRes.ok) throw new Error('Failed to fetch budgets');
        const budgetsData: Budget[] = await budgetsRes.json();
        
        setTransactions(transactionsData);
        setBudgets(budgetsData);
      } catch (err) {
        setError((err as Error).message || 'An unexpected error occurred.');
      }
    };

    fetchData();
  }, []);

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      setError(null);
      const transactionData: Omit<Transaction, '_id'> = {
        amount: Number(formData.amount),
        category: formData.category || 'Other',
        date: formData.date,
        description: formData.description,
        type: formData.type || 'expense'
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error('Failed to add transaction');
      
      const newTransaction: Transaction = await response.json();
      setTransactions((prev) => [...prev, newTransaction]);
      setActiveTab('transactions');
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  const handleEditTransaction = async (formData: TransactionFormData) => {
    try {
      if (!formData._id) throw new Error('Transaction ID is missing');
      
      const transactionData: Transaction = {
        _id: formData._id,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
        type: formData.type
      };

      const response = await fetch(`/api/transactions/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error('Failed to update transaction');
      
      const updatedTransaction: Transaction = await response.json();
      setTransactions((prev) =>
        prev.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t))
      );
      setEditingTransaction(null);
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  const handleAddBudget = async (budgetData: BudgetFormData) => {
    try {
      setError(null);
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) throw new Error('Failed to add budget');
      
      const newBudget: Budget = await response.json();
      setBudgets((prev) => [...prev, newBudget]);
      setShowBudgetForm(false);
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Personal Finance Visualizer</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={(value: string) => setActiveTab(value as TabValue)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <DashboardCards transactions={transactions} budgets={budgets} />
          <MonthlyChart transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="transactions">
          {transactions.length > 0 ? (
            <TransactionList 
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          ) : (
            <p className="text-gray-500">No transactions available.</p>
          )}
          
          {editingTransaction && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-md w-full mx-4">
                <TransactionForm 
                  transaction={{
                    _id: editingTransaction._id,
                    description: editingTransaction.description || '',
                    amount: editingTransaction.amount,
                    date: editingTransaction.date,
                    category: editingTransaction.category,
                    type: editingTransaction.type || 'expense'
                  }}
                  onSubmit={handleEditTransaction}
                  onCancel={() => setEditingTransaction(null)}
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <TransactionForm 
            onSubmit={handleAddTransaction}
            transaction={null}
            onCancel={() => setActiveTab('transactions')}
          />
        </TabsContent>

        <TabsContent value="budgets">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Monthly Budgets</h2>
              <Button onClick={() => setShowBudgetForm(true)}>
                Add Budget
              </Button>
            </div>
            
            <BudgetChart budgets={budgets} transactions={transactions} />
            
            {showBudgetForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-md w-full mx-4">
                  <BudgetForm 
                    onSubmit={handleAddBudget}
                    onCancel={() => setShowBudgetForm(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}