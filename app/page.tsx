'use client';

import { useState, useEffect } from 'react';
import TransactionForm from '@/components/ui/TransactionForm';
import TransactionList from '@/components/ui/TransactionList';
import MonthlyChart from '@/components/ui/Charts/MonthlyChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  type?: string;
}

interface FormTransaction {
  _id?: string;
  description: string;
  amount: number | string;
  date: Date | string;
  category: string;
  type: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'add'>('dashboard');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions. Please try again later.');
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError((err as Error).message || 'An unexpected error occurred.');
      } 
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async (formData: FormTransaction) => {
    try {
      setError(null);
      const transactionData = {
        amount: Number(formData.amount),
        category: formData.category || 'Uncategorized',
        date: formData.date instanceof Date ? formData.date.toISOString() : formData.date,
        description: formData.description,
        type: formData.type || 'expense'
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error('Failed to add transaction. Please try again.');
      
      const newTransaction = await response.json();
      setTransactions((prev) => [...prev, newTransaction]);
      setActiveTab('transactions');
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  const handleEditTransaction = async (formData: FormTransaction) => {
    try {
      setError(null);
      if (!formData._id) throw new Error('Transaction ID is missing');
      
      const transactionData = {
        _id: formData._id,
        amount: Number(formData.amount),
        category: formData.category || 'Uncategorized',
        date: formData.date instanceof Date ? formData.date.toISOString() : formData.date,
        description: formData.description,
        type: formData.type || 'expense'
      };

      const response = await fetch(`/api/transactions/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error('Failed to update transaction. Please try again.');
      
      const updatedTransaction = await response.json();
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
      setError(null);
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction. Please try again.');
      
      setTransactions((prev) => prev.filter((t) => t._id !== id));
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

      <Tabs value={activeTab} onValueChange={(tabValue) => setActiveTab(tabValue as 'dashboard' | 'transactions' | 'add')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <MonthlyChart transactions={transactions} />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
            {transactions.length > 0 ? (
              <TransactionList 
                transactions={transactions.slice(0, 5)} 
                onEdit={setEditingTransaction}
                onDelete={handleDeleteTransaction}
              />
            ) : (
              <p className="text-gray-500">No transactions available.</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setActiveTab('transactions')}>
                View All Transactions
              </Button>
            </div>
          </div>
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
    transaction={null}  // Explicitly pass null for new transactions
    onCancel={() => setActiveTab('transactions')}  // Add cancel handler
  />
</TabsContent>
      </Tabs>
    </main>
  );
}