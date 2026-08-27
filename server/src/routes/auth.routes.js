import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' })

  const password_hash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password_hash, name: name || email.split('@')[0] })

  const token = signToken(user.id)
  res.status(201).json({ token, profile: user.toJSON() })
}))

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const token = signToken(user.id)
  res.json({ token, profile: user.toJSON() })
}))

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ profile: user.toJSON() })
}))

export default router
