import { Router } from 'express'
import Meal from '../models/Meal.js'
import WaterLog from '../models/WaterLog.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/meals', asyncHandler(async (req, res) => {
  const meals = await Meal.find({ user_id: req.userId }).sort({ created_at: -1 })
  res.json(meals)
}))

router.post('/meals', asyncHandler(async (req, res) => {
  const meal = await Meal.create({ ...req.body, user_id: req.userId })
  res.status(201).json(meal)
}))

router.delete('/meals/:id', asyncHandler(async (req, res) => {
  await Meal.deleteOne({ _id: req.params.id, user_id: req.userId })
  res.status(204).end()
}))

router.get('/water-logs/today', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0]
  const log = await WaterLog.findOne({ user_id: req.userId, logged_at: today })
  res.json(log || null)
}))

router.put('/water-logs/today', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0]
  const { glasses } = req.body
  const log = await WaterLog.findOneAndUpdate(
    { user_id: req.userId, logged_at: today },
    { glasses },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  res.json(log)
}))

export default router
