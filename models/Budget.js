import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Date,
    default: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  },
  userId: {  // If you implement auth later
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);