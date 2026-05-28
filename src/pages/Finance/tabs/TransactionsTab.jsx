import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import TransactionList from '../components/TransactionList'

export default function TransactionsTab({ transactions, deleteTransaction, categories = [], currency = 'USD' }) {
  const [search, setSearch] = useState('')

  const filtered = transactions.filter(t => 
    (t.note || '').toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
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
