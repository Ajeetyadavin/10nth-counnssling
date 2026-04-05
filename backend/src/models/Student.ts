import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  answers: { type: Array, default: [] },
  result: { type: Object, default: null },
  status: { type: String, enum: ['Partial', 'Completed'], default: 'Partial' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Student = mongoose.model('Student', StudentSchema);
