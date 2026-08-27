import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const habitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  emoji: { type: String, default: '✅' },
  color: { type: String, default: '#f59e0b' },
  frequency: { type: String, enum: ['daily', 'weekdays', 'weekends', 'custom'], default: 'daily' },
  custom_days: { type: [Number], default: null },
  category: { type: String, default: 'general' },
  archived: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
})

habitSchema.plugin(idPlugin)
export default mongoose.model('Habit', habitSchema)
