import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function BudgetForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // Default to current month (YYYY-MM)
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || isNaN(formData.amount)) {
      newErrors.amount = 'Valid amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be positive';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: new Date(formData.month + '-01') // Convert to first day of month
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Set Budget</h2>
      
      {/* Month Selection */}
      <div className="space-y-2">
        <Label htmlFor="month">Month</Label>
        <Input
          id="month"
          name="month"
          type="month"
          value={formData.month}
          onChange={handleChange}
        />
      </div>
      
      {/* Existing Category Selector */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select 
          value={formData.category}
          onValueChange={(value) => setFormData({...formData, category: value})}
        >
          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'].map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>
      
      {/* Existing Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Budget
        </Button>
      </div>
    </form>
  );
}