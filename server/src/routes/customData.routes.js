import { Router } from 'express'
import CustomExercise from '../models/CustomExercise.js'
import CustomFood from '../models/CustomFood.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/exercises', asyncHandler(async (req, res) => {
  const items = await CustomExercise.find({ user_id: req.userId })
  res.json(items)
}))

router.post('/exercises', asyncHandler(async (req, res) => {
  const item = await CustomExercise.create({ ...req.body, user_id: req.userId })
  res.status(201).json(item)
}))

router.get('/foods', asyncHandler(async (req, res) => {
  const items = await CustomFood.find({ user_id: req.userId })
  res.json(items)
}))

router.post('/foods', asyncHandler(async (req, res) => {
  const item = await CustomFood.create({ ...req.body, user_id: req.userId })
  res.status(201).json(item)
}))

export default router
