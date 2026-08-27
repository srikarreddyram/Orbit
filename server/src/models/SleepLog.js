import mongoose from 'mongoose'
import { idPlugin } from '../utils/idPlugin.js'

const sleepLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bedtime: { type: Date, required: true },
  wake_time: { type: Date, required: true },
  duration_hours: { type: Number, default: 0 },
  quality: { type: Number, min: 1, max: 5, default: null },
  notes: { type: String, default: '' },
  logged_at: { type: String, default: () => new Date().toISOString().split('T')[0] },

  sleep_onset_time: { type: Date, default: null },
  awakenings_count: { type: Number, default: 0 },
  awake_duration_minutes: { type: Number, default: 0 },
  restfulness: { type: String, enum: ['fragmented', 'moderate', 'restful', null], default: null },
  used_screens_late: { type: Boolean, default: false },
  consumed_caffeine_late: { type: Boolean, default: false },
  felt_stressed_anxious: { type: Boolean, default: false },
  took_naps: { type: Boolean, default: false },

  energy_upon_waking: { type: Number, min: 1, max: 10, default: null },
  mental_clarity: { type: Number, min: 1, max: 10, default: null },
  mood: { type: Number, min: 1, max: 10, default: null },
  muscle_soreness: { type: Number, min: 1, max: 10, default: null },
  motivation_to_train: { type: Number, min: 1, max: 10, default: null },
  subjective_quality: { type: Number, min: 1, max: 10, default: null },

  recovery_score: { type: Number, default: null },
  sleep_efficiency: { type: Number, default: null },
  insights_json: { type: [String], default: [] },
})

sleepLogSchema.pre('save', function computeDuration(next) {
  if (this.bedtime && this.wake_time) {
    this.duration_hours = Number(((this.wake_time - this.bedtime) / 36e5).toFixed(2))
  }
  next()
})

sleepLogSchema.plugin(idPlugin)
export default mongoose.model('SleepLog', sleepLogSchema)
