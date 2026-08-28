import { motion } from 'framer-motion'
import { formatCurrency } from '../../../utils/currencyHelpers'

export default function BudgetOverview({ totals = { income: 0, expenses: 0, net: 0 }, monthlyBudget = 0, currency = 'USD' }) {
  const { expenses } = totals
  const remaining = monthlyBudget - expenses
  const isOverBudget = remaining < 0
  const spentPct = monthlyBudget > 0 ? Math.round((expenses / monthlyBudget) * 100) : 0
  const barFillPct = Math.min(spentPct, 100)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const currentDay = now.getDate()
  const monthProgressPct = Math.min((currentDay / daysInMonth) * 100, 100)
  const daysRemaining = Math.max(daysInMonth - currentDay, 0)
  const dailyPace = daysRemaining > 0 && remaining > 0 ? remaining / daysRemaining : 0

  const monthStartLabel = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const monthEndLabel = new Date(year, month + 1, 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="rounded-3xl overflow-hidden border border-white/5 shadow-sm">
      {/* Header — spent-of-budget amount, matching a "Monthly" summary card */}
      <div className={`px-6 py-5 ${isOverBudget ? 'bg-accent-red/20' : 'bg-accent-purple/20'}`}>
        <h2 className="text-xs text-text-secondary uppercase tracking-wider font-bold">Monthly</h2>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-3xl font-bold tracking-tight font-mono-numbers ${isOverBudget ? 'text-accent-red' : 'text-text-primary'}`}>
            {formatCurrency(expenses, currency)}
          </span>
          <span className="text-sm text-text-secondary">spent of {formatCurrency(monthlyBudget, currency)}</span>
        </div>
      </div>

      {/* Progress section */}
      <div className="px-6 py-5 bg-surface/60">
        <div className="relative h-6 bg-void rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barFillPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="absolute top-0 left-0 h-full rounded-full flex items-center justify-center"
            style={{
              background: isOverBudget
                ? 'linear-gradient(90deg, #7F1D1D, #B91C1C)'
                : 'linear-gradient(90deg, #7C3AED, #38BDF8)',
            }}
          >
            {barFillPct > 25 && (
              <span className="text-[10px] font-bold text-white/90">{spentPct}%</span>
            )}
          </motion.div>
        </div>

        <div className="relative h-5 mt-1.5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -translate-x-1/2 px-1.5 py-0.5 bg-elevated border border-white/10 rounded text-[9px] font-bold text-text-primary whitespace-nowrap"
            style={{ left: `${monthProgressPct}%` }}
          >
            Today
          </motion.div>
        </div>

        <div className="flex justify-between text-[11px] text-text-muted font-mono-numbers -mt-1 mb-3">
          <span>{monthStartLabel}</span>
          <span>{monthEndLabel}</span>
        </div>

        {isOverBudget ? (
          <p className="text-xs text-accent-red font-medium text-center">
            {formatCurrency(Math.abs(remaining), currency)} over {formatCurrency(monthlyBudget, currency)} for {daysRemaining} more day{daysRemaining === 1 ? '' : 's'}
          </p>
        ) : daysRemaining > 0 ? (
          <p className="text-xs text-text-secondary text-center">
            You can spend <span className="text-accent-green font-semibold font-mono-numbers">{formatCurrency(dailyPace, currency)}</span> a day for the next {daysRemaining} day{daysRemaining === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
