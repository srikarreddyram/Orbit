import { Building2, CreditCard, Landmark, Wallet } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyHelpers'

const ICONS = {
  checking: Building2,
  savings: Building2,
  credit: CreditCard,
  investment: Landmark,
  cash: Wallet,
  other: Wallet,
}

export default function AccountsCarousel({ accounts = [], currency = 'USD' }) {
  if (accounts.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
      {accounts.map((acc) => {
        const Icon = ICONS[acc.type] || Wallet
        return (
          <div
            key={acc.id}
            className="shrink-0 w-40 p-4 rounded-2xl bg-surface/50 border border-white/5 backdrop-blur-md"
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
            <p className={`text-base font-bold font-mono-numbers truncate ${acc.balance < 0 ? 'text-accent-red' : 'text-text-primary'}`}>
              {formatCurrency(acc.balance, currency)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
