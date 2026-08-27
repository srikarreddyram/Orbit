import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getIconComponent } from './CategoryConfig'
import { formatRelativeDate, formatDate, getToday } from '../../../utils/dateHelpers'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyHelpers'

export default function TransactionList({ transactions, deleteTransaction, categories = [], currency = 'USD' }) {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = {}
    transactions.forEach((t) => {
      const date = t.date || getToday()
      if (!groups[date]) groups[date] = []
      groups[date].push(t)
    })
    return Object.entries(groups)
      .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
      .map(([date, txs]) => ({ date, transactions: txs }))
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-muted text-sm">No transactions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {groupedTransactions.map(({ date, transactions: txs }) => (
        <div key={date}>
          <div className="flex justify-between items-end mb-3 sticky top-14 bg-base/90 backdrop-blur-md py-2 z-10">
            <h3 className="text-[11px] uppercase tracking-widest text-text-muted font-bold">
              {formatRelativeDate(date)}
            </h3>
            <span className="text-[11px] font-mono-numbers text-text-muted">
              {formatDate(date, { year: undefined })}
            </span>
          </div>
          <div className="bg-surface/50 border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            <AnimatePresence initial={false}>
              {txs.map((tx, index) => {
                // Find dynamic category
                const catObj = categories.find(c => c.name === tx.category)
                const color = catObj ? catObj.color : '#6E6877'
                const Icon = getIconComponent(catObj ? catObj.icon : 'Package')
                const isIncome = tx.type === 'income'

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative flex items-center justify-between p-4 transition-colors hover:bg-white/[0.02] ${
                      index !== txs.length - 1 ? 'border-b border-border/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary capitalize">
                          {tx.note || tx.category.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-text-muted capitalize mt-0.5">
                          {tx.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[15px] font-bold font-mono-numbers ${
                        isIncome ? 'text-emerald-400' : 'text-text-primary'
                      }`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                      </span>
                      {deleteTransaction && (
                        <button 
                          onClick={() => deleteTransaction(tx.id)}
                          className="opacity-0 group-hover:opacity-100 absolute right-4 text-accent-red hover:bg-accent-red/10 p-1.5 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}
