import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    stream: { type: String, required: true },
    weight: { type: Number, required: true }
  }],
  category: { type: String, default: 'General' },
  order: { type: Number, default: 0 },
});

export const Question = mongoose.model('Question', QuestionSchema);
