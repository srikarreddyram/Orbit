import { useState, useMemo } from 'react'
import { Search, Filter, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import TransactionList from '../components/TransactionList'
import { formatCurrency } from '../../../utils/currencyHelpers'

function monthKey(dateStr) {
  return dateStr?.slice(0, 7) // "YYYY-MM"
}

function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' })
}

export default function TransactionsTab({ transactions, deleteTransaction, categories = [], currency = 'USD' }) {
  const [search, setSearch] = useState('')

  const months = useMemo(() => {
    const keys = new Set(transactions.map((t) => monthKey(t.date)))
    const currentKey = monthKey(new Date().toISOString().split('T')[0])
    keys.add(currentKey)
    return [...keys].sort()
  }, [transactions])

  const [selectedMonth, setSelectedMonth] = useState(() => monthKey(new Date().toISOString().split('T')[0]))

  const monthTransactions = useMemo(
    () => transactions.filter((t) => monthKey(t.date) === selectedMonth),
    [transactions, selectedMonth]
  )

  const { expense, income } = useMemo(() => {
    return monthTransactions.reduce((acc, t) => {
      if (t.type === 'expense') acc.expense += t.amount
      else acc.income += t.amount
      return acc
    }, { expense: 0, income: 0 })
  }, [monthTransactions])

  const filtered = monthTransactions.filter(t =>
    (t.note || '').toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {months.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedMonth(key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedMonth === key ? 'bg-accent-purple text-white' : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {monthLabel(key)}
          </button>
        ))}
      </div>

      {/* Month summary bar */}
      <div className="flex items-center justify-between bg-surface/50 border border-white/5 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm font-mono-numbers font-semibold text-accent-red">
          <ArrowDownRight size={14} />
          {formatCurrency(expense, currency)}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-mono-numbers font-semibold text-emerald-400">
          <ArrowUpRight size={14} />
          {formatCurrency(income, currency)}
        </div>
        <div className="text-sm font-mono-numbers font-bold text-text-primary">
          = {income - expense >= 0 ? '+' : '-'}{formatCurrency(Math.abs(income - expense), currency)}
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex items-center gap-3 bg-surface/50 p-2 rounded-2xl border border-white/5 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>
        <button className="p-2.5 bg-elevated rounded-xl border border-white/5 text-text-muted hover:text-text-primary transition-colors">
          <Filter size={16} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <TransactionList transactions={filtered} deleteTransaction={deleteTransaction} categories={categories} currency={currency} />
      </div>
    </div>
  )
}
