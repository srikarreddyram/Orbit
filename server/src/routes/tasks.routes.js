import { Router } from 'express'
import Task from '../models/Task.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user_id: req.userId }).sort({ position: 1, created_at: -1 })
  res.json(tasks)
}))

router.post('/', asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user_id: req.userId })
  res.status(201).json(task)
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user_id: req.userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
}))

router.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const { completed } = req.body
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user_id: req.userId },
    { completed, completed_at: completed ? new Date() : null },
    { new: true }
  )
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user_id: req.userId })
  res.status(204).end()
}))

router.post('/reorder', asyncHandler(async (req, res) => {
  const orderedTasks = req.body
  await Promise.all(orderedTasks.map((t, index) =>
    Task.updateOne(
      { _id: t.id, user_id: req.userId },
      { position: index, title: t.title, priority: t.priority, category: t.category, completed: t.completed }
    )
  ))
  res.status(204).end()
}))

export default router
