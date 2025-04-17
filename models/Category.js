import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other']
  },
  color: {
    type: String,
    default: '#8884d8'
  }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);