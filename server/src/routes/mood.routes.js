import { Router } from 'express'
import MoodLog from '../models/MoodLog.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const logs = await MoodLog.find({ user_id: req.userId, logged_at: { $gte: since } }).sort({ logged_at: 1 })
  res.json(logs)
}))

router.post('/', asyncHandler(async (req, res) => {
  const log = await MoodLog.create({ ...req.body, user_id: req.userId })
  res.status(201).json(log)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  await MoodLog.deleteOne({ _id: req.params.id, user_id: req.userId })
  res.status(204).end()
}))

export default router
