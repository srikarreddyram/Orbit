import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const recurringSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  next_date: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
})

recurringSchema.plugin(idPlugin)
export default mongoose.model('RecurringTransaction', recurringSchema)
