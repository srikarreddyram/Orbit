import { Router } from 'express'
import Habit from '../models/Habit.js'
import HabitCompletion from '../models/HabitCompletion.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const filter = { user_id: req.userId }
  if (req.query.all !== 'true') filter.archived = false
  const habits = await Habit.find(filter).sort({ created_at: 1 })
  res.json(habits)
}))

router.post('/', asyncHandler(async (req, res) => {
  const habit = await Habit.create({ ...req.body, user_id: req.userId })
  res.status(201).json(habit)
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user_id: req.userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!habit) return res.status(404).json({ error: 'Habit not found' })
  res.json(habit)
}))

router.get('/completions', asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const completions = await HabitCompletion.find({ user_id: req.userId, completed_on: { $gte: since } })
  res.json(completions)
}))

router.post('/completions/toggle', asyncHandler(async (req, res) => {
  const { habitId, date, isCompleted } = req.body
  if (isCompleted) {
    await HabitCompletion.deleteOne({ habit_id: habitId, completed_on: date, user_id: req.userId })
  } else {
    await HabitCompletion.create({ habit_id: habitId, user_id: req.userId, completed_on: date })
  }
  res.status(204).end()
}))

export default router
