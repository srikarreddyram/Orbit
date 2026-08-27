import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const categorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  color: { type: String, default: '#60a5fa' },
  icon: { type: String, default: 'Package' },
  created_at: { type: Date, default: Date.now },
})
categorySchema.index({ user_id: 1, name: 1, type: 1 }, { unique: true })

categorySchema.plugin(idPlugin)
export default mongoose.model('TransactionCategory', categorySchema)
