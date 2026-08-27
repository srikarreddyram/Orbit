import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  note: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  created_at: { type: Date, default: Date.now },
})

transactionSchema.plugin(idPlugin)
export default mongoose.model('Transaction', transactionSchema)
