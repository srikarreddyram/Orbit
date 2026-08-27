import { Router } from 'express'
import UserMetrics from '../models/UserMetrics.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const metrics = await UserMetrics.findOne({ user_id: req.userId })
  res.json(metrics || {
    weight_kg: 70, height_cm: 170, age: 30, gender: 'other', activity_level: 'moderately_active',
  })
}))

router.put('/', asyncHandler(async (req, res) => {
  const metrics = await UserMetrics.findOneAndUpdate(
    { user_id: req.userId },
    { ...req.body, user_id: req.userId, updated_at: new Date() },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  )
  res.json(metrics)
}))

export default router
