import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import PropTypes from 'prop-types';

export default function TransactionForm({ onSubmit, transaction, onCancel }) {
  // Initialize form state with transaction data or defaults
  const [formData, setFormData] = useState({
    _id: transaction?._id || null,
    description: transaction?.description || '',
    amount: transaction?.amount?.toString() || '',
    date: transaction?.date ? new Date(transaction.date) : new Date(),
    category: transaction?.category || '',
    type: transaction?.type || 'expense'
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleDateChange = (date) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount)) {
      newErrors.amount = 'Amount must be a number';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be positive';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Prepare the data for submission
      const submissionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString()
      };
      
      // Clean up data before submitting
      if (!submissionData._id) {
        delete submissionData._id;
      }
      
      onSubmit(submissionData);
      
      // Reset form if not editing
      if (!transaction) {
        setFormData({
          _id: null,
          description: '',
          amount: '',
          date: new Date(),
          category: '',
          type: 'expense'
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Grocery shopping"
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      
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
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Food, Utilities"
          className={errors.category ? "border-red-500" : ""}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Expense</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Income</span>
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(formData.date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-4 py-2"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700"
        >
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
}
TransactionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    transaction: PropTypes.shape({
      _id: PropTypes.string,
      description: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      category: PropTypes.string,
      type: PropTypes.string
    }),
    onCancel: PropTypes.func
  };