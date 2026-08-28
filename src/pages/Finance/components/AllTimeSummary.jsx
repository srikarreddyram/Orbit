import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyHelpers'

export default function AllTimeSummary({ transactions = [], currency = 'USD' }) {
  const { expenseTotal, expenseCount, incomeTotal, incomeCount } = useMemo(() => {
    let expenseTotal = 0, expenseCount = 0, incomeTotal = 0, incomeCount = 0
    for (const t of transactions) {
      if (t.type === 'expense') { expenseTotal += t.amount; expenseCount += 1 }
      else if (t.type === 'income') { incomeTotal += t.amount; incomeCount += 1 }
    }
    return { expenseTotal, expenseCount, incomeTotal, incomeCount }
  }, [transactions])

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface/40 rounded-3xl p-5 border border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold uppercase tracking-wider">
          <ArrowDownRight size={14} className="text-accent-red" /> Expense
        </div>
        <p className="text-2xl font-bold font-mono-numbers text-accent-red mt-2">{formatCurrency(expenseTotal, currency)}</p>
        <p className="text-xs text-text-muted mt-1">×{expenseCount} All Time</p>
      </div>
      <div className="bg-surface/40 rounded-3xl p-5 border border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold uppercase tracking-wider">
          <ArrowUpRight size={14} className="text-emerald-400" /> Income
        </div>
        <p className="text-2xl font-bold font-mono-numbers text-emerald-400 mt-2">{formatCurrency(incomeTotal, currency)}</p>
        <p className="text-xs text-text-muted mt-1">×{incomeCount} All Time</p>
      </div>
    </div>
  )
}
