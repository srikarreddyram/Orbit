import AccountsCarousel from '../components/AccountsCarousel'
import BudgetOverview from '../components/BudgetOverview'
import SpendingChart from '../components/SpendingChart'
import CategoryDonut from '../components/CategoryDonut'
import CategoryBreakdown from '../components/CategoryBreakdown'

export default function DashboardTab({ monthTransactions, transactions = [], monthlyBudget, accounts = [], categories = [], currency = 'USD', onSelectAccount }) {
  const monthExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <AccountsCarousel accounts={accounts} transactions={transactions} currency={currency} onSelect={onSelectAccount} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-surface/40 rounded-3xl p-6 border border-white/5 shadow-sm backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-purple/20 blur-[60px] rounded-full pointer-events-none" />
            <BudgetOverview
              totals={{ expenses: monthExpenses }}
              monthlyBudget={monthlyBudget}
              currency={currency}
            />
          </div>
          <CategoryDonut transactions={monthTransactions} categories={categories} currency={currency} />
          <CategoryBreakdown transactions={monthTransactions} categories={categories} currency={currency} />
        </div>

        <div className="lg:col-span-7 xl:col-span-8 min-w-0">
          <SpendingChart transactions={monthTransactions} monthlyBudget={monthlyBudget} currency={currency} />
        </div>
      </div>
    </div>
  )
}
