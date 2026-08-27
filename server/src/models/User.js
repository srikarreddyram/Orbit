import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  name: { type: String, default: '' },
  avatar_url: { type: String, default: null },
  daily_calorie_goal: { type: Number, default: 2000 },
  daily_water_goal: { type: Number, default: 8 },
  weekly_workout_goal: { type: Number, default: 4 },
  monthly_budget: { type: Number, default: 2500 },
  currency: { type: String, default: 'USD' },
  lifescore_weights: {
    type: Object,
    default: { tasks: 25, workouts: 25, calories: 25, finance: 25 },
  },
  created_at: { type: Date, default: Date.now },
})

userSchema.plugin(idPlugin)
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id
    delete ret.__v
    delete ret.password_hash
    return ret
  },
})

export default mongoose.model('User', userSchema)
