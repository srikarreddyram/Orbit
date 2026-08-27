import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const moodLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mood: { type: Number, min: 1, max: 5, required: true },
  energy: { type: Number, min: 1, max: 5, default: null },
  note: { type: String, default: '' },
  journal_entry: { type: String, default: '' },
  logged_at: { type: String, default: () => new Date().toISOString().split('T')[0] },
  created_at: { type: Date, default: Date.now },
})

moodLogSchema.plugin(idPlugin)
export default mongoose.model('MoodLog', moodLogSchema)
