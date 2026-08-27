import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const waterLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  glasses: { type: Number, default: 1 },
  logged_at: { type: String, default: () => new Date().toISOString().split('T')[0] },
  created_at: { type: Date, default: Date.now },
})
waterLogSchema.index({ user_id: 1, logged_at: 1 }, { unique: true })

waterLogSchema.plugin(idPlugin)
export default mongoose.model('WaterLog', waterLogSchema)
