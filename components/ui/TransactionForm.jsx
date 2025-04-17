import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Predefined categories with colors for consistency
const CATEGORIES = [
  { value: 'Food', label: 'Food', color: '#FF6384' },
  { value: 'Transport', label: 'Transport', color: '#36A2EB' },
  { value: 'Housing', label: 'Housing', color: '#FFCE56' },
  { value: 'Entertainment', label: 'Entertainment', color: '#4BC0C0' },
  { value: 'Utilities', label: 'Utilities', color: '#9966FF' },
  { value: 'Other', label: 'Other', color: '#FF9F40' }
];

export default function TransactionForm({ onSubmit, transaction, onCancel }) {
  // Initialize form state with transaction data or defaults
  const [formData, setFormData] = useState({
    _id: transaction?._id || null,
    description: transaction?.description || '',
    amount: transaction?.amount?.toString() || '',
    date: transaction?.date ? new Date(transaction.date) : new Date(),
    category: transaction?.category || 'Food', // Default to first category
    type: transaction?.type || 'expense'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) setErrors(prev => ({ ...prev, category: null }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('CATEGORY BEING SAVED:', formData.category);
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Prepare the data for submission
        const submissionData = {
          ...formData,
          amount: parseFloat(formData.amount),
          date: formData.date.toISOString(),
          category: formData.category
        };
        
        // Clean up data before submitting
        if (!submissionData._id) {
          delete submissionData._id;
        }
        
        await onSubmit(submissionData);
        
        // Reset form if not editing
        if (!transaction) {
          setFormData({
            _id: null,
            description: '',
            amount: '',
            date: new Date(),
            category: 'Food',
            type: 'expense'
          });
        }
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Grocery shopping"
          className={errors.description ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount*</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          className={errors.amount ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Category*</Label>
        <Select 
          value={formData.category}
          onValueChange={handleCategoryChange}
          disabled={isSubmitting}
        >
          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className="flex items-center"
              >
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Transaction Type*</Label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <span>Income</span>
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Date*</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {transaction ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            transaction ? 'Update Transaction' : 'Add Transaction'
          )}
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