import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const setSchema = new mongoose.Schema({
  exercise_name: { type: String, required: true },
  sets: { type: Number, default: null },
  reps: { type: Number, default: null },
  weight_kg: { type: Number, default: null },
}, { _id: true })
setSchema.plugin(idPlugin)

const workoutSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['cardio', 'strength', 'yoga', 'sports', 'other'], required: true },
  duration_minutes: { type: Number, required: true },
  calories_burned: { type: Number, default: null },
  notes: { type: String, default: '' },
  logged_at: { type: Date, default: Date.now },
  sets: { type: [setSchema], default: [] },
})

workoutSchema.plugin(idPlugin)
export default mongoose.model('Workout', workoutSchema)
