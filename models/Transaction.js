// models/Transaction.js
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense',
  },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'],
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);