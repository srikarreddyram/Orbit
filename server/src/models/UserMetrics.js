import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const userMetricsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  height_cm: { type: Number, default: 170 },
  weight_kg: { type: Number, default: 70 },
  age: { type: Number, default: 30 },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'other' },
  activity_level: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
    default: 'moderately_active',
  },
  body_fat_percentage: { type: Number, default: null },
  updated_at: { type: Date, default: Date.now },
})

userMetricsSchema.plugin(idPlugin)
export default mongoose.model('UserMetrics', userMetricsSchema)
