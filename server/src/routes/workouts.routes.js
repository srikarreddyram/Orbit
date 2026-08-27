import { Router } from 'express'
import Workout from '../models/Workout.js'
import PersonalRecord from '../models/PersonalRecord.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user_id: req.userId }).sort({ logged_at: -1 }).limit(30)
  res.json(workouts)
}))

router.post('/', asyncHandler(async (req, res) => {
  const { workout, sets = [] } = req.body
  const created = await Workout.create({ ...workout, user_id: req.userId, sets })
  res.status(201).json(created)
}))

router.get('/personal-records', asyncHandler(async (req, res) => {
  const records = await PersonalRecord.find({ user_id: req.userId }).sort({ achieved_at: -1 })
  res.json(records)
}))

router.post('/personal-records', asyncHandler(async (req, res) => {
  const record = await PersonalRecord.create({ ...req.body, user_id: req.userId })
  res.status(201).json(record)
}))

export default router
