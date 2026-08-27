import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const budgetLimitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true },
  monthly_limit: { type: Number, required: true },
})
budgetLimitSchema.index({ user_id: 1, category: 1 }, { unique: true })

budgetLimitSchema.plugin(idPlugin)
export default mongoose.model('BudgetLimit', budgetLimitSchema)
