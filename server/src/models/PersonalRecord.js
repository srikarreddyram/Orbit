import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const personalRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  exercise_name: { type: String, required: true },
  record_type: { type: String, enum: ['weight', 'reps', 'duration', 'distance'], default: 'weight' },
  value: { type: Number, required: true },
  achieved_at: { type: String, default: () => new Date().toISOString().split('T')[0] },
})

personalRecordSchema.plugin(idPlugin)
export default mongoose.model('PersonalRecord', personalRecordSchema)
