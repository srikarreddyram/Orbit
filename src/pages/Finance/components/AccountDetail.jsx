import { useMemo } from 'react'
import { ArrowLeft, Building2, CreditCard, Landmark, Trash2, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '../../../utils/currencyHelpers'
import { getMonthStart } from '../../../utils/dateHelpers'
import TransactionList from './TransactionList'
import CategoryDonut from './CategoryDonut'
import CategoryBreakdown from './CategoryBreakdown'

const ICONS = {
  checking: Building2,
  savings: Building2,
  credit: CreditCard,
  investment: Landmark,
  cash: Wallet,
  other: Wallet,
}

export default function AccountDetail({ account, transactions, categories, deleteTransaction, deleteAccount, currency, onBack }) {
  const Icon = ICONS[account.type] || Wallet
  const isCredit = account.type === 'credit'

  const handleDelete = async () => {
    if (!confirm(`Delete "${account.name}"? Past transactions will be kept but unlinked from this account.`)) return
    try {
      await deleteAccount(account.id)
      toast.success('Account deleted')
      onBack()
    } catch {
      toast.error('Failed to delete account')
    }
  }

  const accountTx = useMemo(
    () => transactions.filter((t) => t.account_id === account.id),
    [transactions, account.id]
  )

  const { allTimeExpense, monthlyExpense } = useMemo(() => {
    const monthStart = getMonthStart()
    let allTime = 0
    let monthly = 0
    for (const t of accountTx) {
      if (t.type !== 'expense') continue
      allTime += t.amount
      if (t.date >= monthStart) monthly += t.amount
    }
    return { allTimeExpense: allTime, monthlyExpense: monthly }
  }, [accountTx])

  const limitPct = isCredit && account.credit_limit > 0
    ? Math.min(100, (monthlyExpense / account.credit_limit) * 100)
    : 0

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Accounts
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-red transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${account.color}20` }}
        >
          <Icon size={22} style={{ color: account.color }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{account.name}</h2>
          <p className="text-sm text-text-muted capitalize">{account.type}</p>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface/40 rounded-3xl p-5 border border-white/5">
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">This Month</p>
          <p className="text-2xl font-bold font-mono-numbers text-text-primary">{formatCurrency(monthlyExpense, currency)}</p>
          {isCredit && account.credit_limit ? (
            <p className="text-xs text-text-muted mt-1">of {formatCurrency(account.credit_limit, currency)} limit</p>
          ) : null}
        </div>
        <div className="bg-surface/40 rounded-3xl p-5 border border-white/5">
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">All Time</p>
          <p className="text-2xl font-bold font-mono-numbers text-text-primary">{formatCurrency(allTimeExpense, currency)}</p>
          <p className="text-xs text-text-muted mt-1">{accountTx.length} transaction{accountTx.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {isCredit && account.credit_limit > 0 ? (
        <div className="bg-surface/40 rounded-3xl p-5 border border-white/5">
          <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">
            <span>Spent this month</span>
            <span>{Math.round((monthlyExpense / account.credit_limit) * 100)}% of limit</span>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${limitPct}%`,
                backgroundColor: monthlyExpense > account.credit_limit ? '#B91C1C' : account.color,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-surface/40 rounded-3xl p-5 border border-white/5 flex justify-between items-center">
          <span className="text-sm text-text-secondary">Current Balance</span>
          <span className={`text-xl font-bold font-mono-numbers ${account.balance < 0 ? 'text-accent-red' : 'text-text-primary'}`}>
            {formatCurrency(account.balance, currency)}
          </span>
        </div>
      )}

      {accountTx.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryDonut transactions={accountTx} categories={categories} currency={currency} />
          <CategoryBreakdown transactions={accountTx} categories={categories} currency={currency} periodLabel="All Time" />
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-text-primary mb-3 px-1">Transactions</h3>
        <TransactionList transactions={accountTx} deleteTransaction={deleteTransaction} categories={categories} currency={currency} />
      </div>
    </div>
  )
}
