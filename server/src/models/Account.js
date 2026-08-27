import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const accountSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['checking', 'savings', 'credit', 'investment', 'cash', 'other'], required: true },
  balance: { type: Number, default: 0 },
  credit_limit: { type: Number, default: null },
  currency: { type: String, default: 'USD' },
  icon: { type: String, default: 'Wallet' },
  color: { type: String, default: '#60a5fa' },
  created_at: { type: Date, default: Date.now },
})

accountSchema.plugin(idPlugin)
export default mongoose.model('Account', accountSchema)
