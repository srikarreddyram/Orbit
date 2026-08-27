import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const habitCompletionSchema = new mongoose.Schema({
  habit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  completed_on: { type: String, required: true },
})
habitCompletionSchema.index({ habit_id: 1, completed_on: 1 }, { unique: true })

habitCompletionSchema.plugin(idPlugin)
export default mongoose.model('HabitCompletion', habitCompletionSchema)
