import { Router } from 'express'
import Transaction from '../models/Transaction.js'
import BudgetLimit from '../models/BudgetLimit.js'
import Account from '../models/Account.js'
import RecurringTransaction from '../models/RecurringTransaction.js'
import TransactionCategory from '../models/TransactionCategory.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.use(requireAuth)

const DEFAULT_CATEGORIES = [
  { name: 'food', type: 'expense', color: '#f59e0b', icon: 'UtensilsCrossed' },
  { name: 'transport', type: 'expense', color: '#60a5fa', icon: 'Car' },
  { name: 'entertainment', type: 'expense', color: '#7c6af7', icon: 'Film' },
  { name: 'bills', type: 'expense', color: '#f87171', icon: 'Zap' },
  { name: 'health', type: 'expense', color: '#ec4899', icon: 'Heart' },
  { name: 'shopping', type: 'expense', color: '#fb923c', icon: 'ShoppingCart' },
  { name: 'housing', type: 'expense', color: '#14b8a6', icon: 'Home' },
  { name: 'coffee', type: 'expense', color: '#8b5cf6', icon: 'Coffee' },
  { name: 'travel', type: 'expense', color: '#0ea5e9', icon: 'Plane' },
  { name: 'tech', type: 'expense', color: '#64748b', icon: 'Laptop' },
  { name: 'other', type: 'expense', color: '#94a3b8', icon: 'Package' },
  { name: 'salary', type: 'income', color: '#34d399', icon: 'ArrowDownRight' },
  { name: 'savings', type: 'income', color: '#10b981', icon: 'PiggyBank' },
  { name: 'investment', type: 'income', color: '#059669', icon: 'ArrowUpRight' },
  { name: 'other_income', type: 'income', color: '#a7f3d0', icon: 'Package' },
]

async function bootstrapCategories(userId) {
  const existing = await TransactionCategory.countDocuments({ user_id: userId })
  if (existing > 0) return
  await TransactionCategory.insertMany(
    DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId }))
  )
}

// --- Transactions ---
router.get('/transactions', asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user_id: req.userId })
    .sort({ date: -1, created_at: -1 })
  res.json(transactions)
}))

router.post('/transactions', asyncHandler(async (req, res) => {
  const tx = await Transaction.create({ ...req.body, user_id: req.userId })
  res.status(201).json(tx)
}))

router.delete('/transactions/:id', asyncHandler(async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.id, user_id: req.userId })
  res.status(204).end()
}))

// --- Budget limits ---
router.get('/budget-limits', asyncHandler(async (req, res) => {
  const limits = await BudgetLimit.find({ user_id: req.userId })
  res.json(limits)
}))

router.put('/budget-limits', asyncHandler(async (req, res) => {
  const { category, limit_amount, period } = req.body
  const limit = await BudgetLimit.findOneAndUpdate(
    { user_id: req.userId, category },
    { limit_amount, period: period || 'monthly' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  res.json(limit)
}))

router.delete('/budget-limits/:id', asyncHandler(async (req, res) => {
  await BudgetLimit.deleteOne({ _id: req.params.id, user_id: req.userId })
  res.status(204).end()
}))

// --- Accounts ---
router.get('/accounts', asyncHandler(async (req, res) => {
  const accounts = await Account.find({ user_id: req.userId })
  res.json(accounts)
}))

router.post('/accounts', asyncHandler(async (req, res) => {
  const account = await Account.create({ ...req.body, user_id: req.userId })
  res.status(201).json(account)
}))

router.delete('/accounts/:id', asyncHandler(async (req, res) => {
  await Account.deleteOne({ _id: req.params.id, user_id: req.userId })
  // Keep the transaction history, just unlink it from the now-deleted account
  await Transaction.updateMany(
    { account_id: req.params.id, user_id: req.userId },
    { $unset: { account_id: '' } }
  )
  res.status(204).end()
}))

// --- Recurring transactions ---
router.get('/recurring-transactions', asyncHandler(async (req, res) => {
  const items = await RecurringTransaction.find({ user_id: req.userId })
  res.json(items)
}))

router.post('/recurring-transactions', asyncHandler(async (req, res) => {
  const item = await RecurringTransaction.create({ ...req.body, user_id: req.userId })
  res.status(201).json(item)
}))

// --- Categories ---
router.get('/categories', asyncHandler(async (req, res) => {
  await bootstrapCategories(req.userId)
  const categories = await TransactionCategory.find({ user_id: req.userId }).sort({ name: 1 })
  res.json(categories)
}))

router.post('/categories', asyncHandler(async (req, res) => {
  const category = await TransactionCategory.create({ ...req.body, user_id: req.userId })
  res.status(201).json(category)
}))

router.delete('/categories/:id', asyncHandler(async (req, res) => {
  await TransactionCategory.deleteOne({ _id: req.params.id, user_id: req.userId })
  res.status(204).end()
}))

router.post('/categories/restore-defaults', asyncHandler(async (req, res) => {
  await Promise.all(DEFAULT_CATEGORIES.map((c) =>
    TransactionCategory.findOneAndUpdate(
      { user_id: req.userId, name: c.name, type: c.type },
      { color: c.color, icon: c.icon },
      { upsert: true, setDefaultsOnInsert: true }
    )
  ))
  res.status(204).end()
}))

export default router
