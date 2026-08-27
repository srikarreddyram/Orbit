import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import taskRoutes from './routes/tasks.routes.js'
import workoutRoutes from './routes/workouts.routes.js'
import nutritionRoutes from './routes/nutrition.routes.js'
import financeRoutes from './routes/finance.routes.js'
import habitRoutes from './routes/habits.routes.js'
import moodRoutes from './routes/mood.routes.js'
import metricsRoutes from './routes/metrics.routes.js'
import customDataRoutes from './routes/customData.routes.js'
import exportRoutes from './routes/export.routes.js'

const app = express()

// Supports a comma-separated list so the dev server can be reached from
// both localhost and a LAN IP (e.g. testing on a phone on the same wifi).
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*').split(',').map((o) => o.trim())
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/mood-logs', moodRoutes)
app.use('/api/user-metrics', metricsRoutes)
app.use('/api/custom', customDataRoutes)
app.use('/api/export', exportRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Orbit API listening on :${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })
