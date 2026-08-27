import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const customExerciseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['strength', 'cardio', 'yoga', 'sports', 'rehab', 'other'], default: 'strength' },
  target_muscles: { type: [String], default: [] },
  equipment: { type: [String], default: [] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', null], default: null },
  instructions: { type: String, default: '' },
  base_met: { type: Number, default: null },
  created_at: { type: Date, default: Date.now },
})
customExerciseSchema.index({ user_id: 1, name: 1 }, { unique: true })

customExerciseSchema.plugin(idPlugin)
export default mongoose.model('CustomExercise', customExerciseSchema)
