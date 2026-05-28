import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyHelpers'

export default function BudgetOverview({ totals = { income: 0, expenses: 0, net: 0 }, monthlyBudget = 0, currency = 'USD' }) {
  const { expenses, net } = totals
  const budgetPct = monthlyBudget > 0 ? (expenses / monthlyBudget) * 100 : 0
  const isOverBudget = expenses > monthlyBudget

  // Safe percentage for visual filling (max 100%)
  const safePct = Math.min(budgetPct, 100)

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center space-y-1"
      >
        <h2 className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Net Balance</h2>
        <div className="flex items-baseline mt-2">
          <span className={`text-6xl font-bold tracking-tight font-mono-numbers ${
            net >= 0 ? 'text-text-primary' : 'text-accent-red'
          }`}>
            {formatCurrency(net, currency)}
          </span>
        </div>
      </motion.div>

      {/* Budget Progress Bar */}
      <div className="w-full max-w-sm mt-10 space-y-3">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-base font-bold font-mono-numbers ${isOverBudget ? 'text-accent-red' : 'text-text-primary'}`}>
              {formatCurrency(expenses, currency)}
            </span>
            <span className="text-xs text-text-muted font-mono-numbers">/ {formatCurrency(monthlyBudget, currency)}</span>
          </div>
          <span className="text-xs font-semibold text-text-muted">{budgetPct.toFixed(0)}%</span>
        </div>
        
        <div className="relative h-4 bg-surface rounded-full overflow-hidden shadow-inner border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safePct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className={`absolute top-0 left-0 h-full rounded-full ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-500 to-red-400'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
            }`}
            style={{
              boxShadow: isOverBudget 
                ? '0 0 10px rgba(239, 68, 68, 0.5)' 
                : '0 0 10px rgba(16, 185, 129, 0.5)'
            }}
          />
          {/* Overbudget marker indicator */}
          {budgetPct > 0 && budgetPct < 100 && (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
              style={{ left: `${safePct}%` }}
             />
          )}
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-medium">
          {isOverBudget ? (
            <>
              <TrendingUp size={14} className="text-accent-red" />
              <span className="text-accent-red">{formatCurrency(expenses - monthlyBudget, currency)} Over Budget</span>
            </>
          ) : (
            <>
              <TrendingDown size={14} className="text-accent-green" />
              <span className="text-accent-green">{formatCurrency(monthlyBudget - expenses, currency)} Remaining</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
