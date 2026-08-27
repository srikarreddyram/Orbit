import { motion } from 'framer-motion'
import { formatCurrency } from '../../../utils/currencyHelpers'

export default function BudgetOverview({ totals = { income: 0, expenses: 0, net: 0 }, monthlyBudget = 0, currency = 'USD' }) {
  const { expenses } = totals
  const remaining = monthlyBudget - expenses
  const isOverBudget = remaining < 0

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
    <div className="flex flex-col items-center py-6">
      <h2 className="text-sm text-text-secondary uppercase tracking-wider font-semibold">This Month</h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="flex items-baseline gap-2 mt-2"
      >
        <span className={`text-5xl font-bold tracking-tight font-mono-numbers ${isOverBudget ? 'text-accent-red' : 'text-text-primary'}`}>
          {formatCurrency(Math.abs(remaining), currency)}
        </span>
        <span className="text-sm text-text-muted">
          {isOverBudget ? 'over' : 'left'} of {formatCurrency(monthlyBudget, currency)}
        </span>
      </motion.div>

      {/* Date-range progress bar with a "Today" marker */}
      <div className="w-full max-w-sm mt-10">
        <div className="relative h-3 bg-surface rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${monthProgressPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: isOverBudget
                ? 'linear-gradient(90deg, #7F1D1D, #B91C1C)'
                : 'linear-gradient(90deg, #7C3AED, #38BDF8)',
            }}
          />
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

        <div className="flex justify-between text-[11px] text-text-muted font-mono-numbers -mt-1">
          <span>{monthStartLabel}</span>
          <span>{monthEndLabel}</span>
        </div>
      </div>

      {isOverBudget ? (
        <p className="text-xs text-accent-red mt-5 font-medium text-center max-w-xs">
          You've gone {formatCurrency(Math.abs(remaining), currency)} over your budget this month.
        </p>
      ) : daysRemaining > 0 ? (
        <p className="text-xs text-text-secondary mt-5 text-center max-w-xs">
          You can spend <span className="text-accent-green font-semibold font-mono-numbers">{formatCurrency(dailyPace, currency)}</span> a day for the next {daysRemaining} day{daysRemaining === 1 ? '' : 's'}.
        </p>
      ) : null}
    </div>
  )
}
