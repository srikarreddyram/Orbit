import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import Task from '../models/Task.js'
import Workout from '../models/Workout.js'
import PersonalRecord from '../models/PersonalRecord.js'
import SleepLog from '../models/SleepLog.js'
import Meal from '../models/Meal.js'
import WaterLog from '../models/WaterLog.js'
import Transaction from '../models/Transaction.js'
import BudgetLimit from '../models/BudgetLimit.js'
import Account from '../models/Account.js'
import RecurringTransaction from '../models/RecurringTransaction.js'
import TransactionCategory from '../models/TransactionCategory.js'
import Habit from '../models/Habit.js'
import HabitCompletion from '../models/HabitCompletion.js'
import MoodLog from '../models/MoodLog.js'
import UserMetrics from '../models/UserMetrics.js'
import CustomExercise from '../models/CustomExercise.js'
import CustomFood from '../models/CustomFood.js'
import User from '../models/User.js'

const router = Router()
router.use(requireAuth)

const COLLECTIONS = {
  tasks: Task, workouts: Workout, personal_records: PersonalRecord,
  sleep_logs: SleepLog, meals: Meal, water_logs: WaterLog,
  transactions: Transaction, budget_limits: BudgetLimit, accounts: Account,
  recurring_transactions: RecurringTransaction, transaction_categories: TransactionCategory,
  habits: Habit, habit_completions: HabitCompletion, mood_logs: MoodLog,
  user_metrics: UserMetrics, custom_exercises: CustomExercise, custom_foods: CustomFood,
}

router.get('/', asyncHandler(async (req, res) => {
  const profile = await User.findById(req.userId)
  const data = { profile: profile ? profile.toJSON() : null }

  for (const [key, Model] of Object.entries(COLLECTIONS)) {
    data[key] = await Model.find({ user_id: req.userId })
  }

  res.json(data)
}))

export default router
