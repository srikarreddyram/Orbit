import { useMemo } from 'react'
import { Building2, CreditCard, Landmark, Wallet } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyHelpers'
import { getMonthStart } from '../../../utils/dateHelpers'

const ICONS = {
  checking: Building2,
  savings: Building2,
  credit: CreditCard,
  investment: Landmark,
  cash: Wallet,
  other: Wallet,
}

export default function AccountsCarousel({ accounts = [], transactions = [], currency = 'USD', onSelect }) {
  const statsByAccount = useMemo(() => {
    const monthStart = getMonthStart()
    const stats = {}
    for (const t of transactions) {
      if (!t.account_id) continue
      if (!stats[t.account_id]) stats[t.account_id] = { count: 0, monthlySpend: 0 }
      stats[t.account_id].count += 1
      if (t.type === 'expense' && t.date >= monthStart) stats[t.account_id].monthlySpend += t.amount
    }
    return stats
  }, [transactions])

  if (accounts.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
      {accounts.map((acc) => {
        const Icon = ICONS[acc.type] || Wallet
        const isCredit = acc.type === 'credit'
        const stats = statsByAccount[acc.id] || { count: 0, monthlySpend: 0 }

        return (
          <button
            key={acc.id}
            onClick={() => onSelect?.(acc)}
            className="shrink-0 w-40 p-4 rounded-2xl bg-surface/50 border border-white/5 backdrop-blur-md text-left hover:bg-surface/80 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${acc.color}20` }}
              >
                <Icon size={13} style={{ color: acc.color }} />
              </div>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: acc.color }} />
            </div>
            <p className="text-xs font-medium text-text-secondary truncate mb-1">{acc.name}</p>
            {isCredit ? (
              <p className="text-base font-bold font-mono-numbers truncate text-text-primary">
                {formatCurrency(stats.monthlySpend, currency)}
                <span className="text-[10px] text-text-muted font-sans font-normal ml-1">this mo.</span>
              </p>
            ) : (
              <p className={`text-base font-bold font-mono-numbers truncate ${acc.balance < 0 ? 'text-accent-red' : 'text-text-primary'}`}>
                {formatCurrency(acc.balance, currency)}
              </p>
            )}
            <p className="text-[10px] text-text-muted mt-1">{stats.count} transaction{stats.count === 1 ? '' : 's'}</p>
          </button>
        )
      })}
    </div>
  )
}
