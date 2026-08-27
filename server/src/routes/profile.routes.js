import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

const ALLOWED_FIELDS = [
  'name', 'avatar_url', 'daily_calorie_goal', 'daily_water_goal',
  'weekly_workout_goal', 'monthly_budget',
  'currency', 'lifescore_weights',
]

router.patch('/', asyncHandler(async (req, res) => {
  const updates = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in req.body) updates[key] = req.body[key]
  }
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true })
  res.json(user.toJSON())
}))

export default router
