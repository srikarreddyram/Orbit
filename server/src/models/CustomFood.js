import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const customFoodSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  // Nutrition below is per this base amount/unit (e.g. per 100g) — scaled
  // client-side to whatever quantity the user actually logs.
  base_amount: { type: Number, required: true, default: 100 },
  base_unit: { type: String, enum: ['g', 'ml', 'oz', 'serving'], default: 'g' },
  calories: { type: Number, required: true },
  protein_g: { type: Number, default: 0 },
  carbs_g: { type: Number, default: 0 },
  sugar_g: { type: Number, default: 0 },
  fat_g: { type: Number, default: 0 },
  cholesterol_mg: { type: Number, default: 0 },
  barcode: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
})
customFoodSchema.index({ user_id: 1, name: 1 }, { unique: true })

customFoodSchema.plugin(idPlugin)
export default mongoose.model('CustomFood', customFoodSchema)
