import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const budgetLimitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true },
  limit_amount: { type: Number, required: true },
  period: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'], default: 'monthly' },
})
budgetLimitSchema.index({ user_id: 1, category: 1 }, { unique: true })

budgetLimitSchema.plugin(idPlugin)
export default mongoose.model('BudgetLimit', budgetLimitSchema)
