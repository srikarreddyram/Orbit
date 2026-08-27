import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const mealSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  meal_type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  food_item: { type: String, required: true },
  calories: { type: Number, required: true },
  protein_g: { type: Number, default: 0 },
  carbs_g: { type: Number, default: 0 },
  sugar_g: { type: Number, default: 0 },
  fat_g: { type: Number, default: 0 },
  cholesterol_mg: { type: Number, default: 0 },
  logged_at: { type: String, default: () => new Date().toISOString().split('T')[0] },
  created_at: { type: Date, default: Date.now },
})

mealSchema.plugin(idPlugin)
export default mongoose.model('Meal', mealSchema)
