import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const taskSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  due_date: { type: String, default: null },
  due_time: { type: String, default: null },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['work', 'personal', 'health', 'finance', 'other'], default: 'personal' },
  completed: { type: Boolean, default: false },
  completed_at: { type: Date, default: null },
  position: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
})

taskSchema.plugin(idPlugin)
export default mongoose.model('Task', taskSchema)
