import { Target } from 'lucide-react'
import AccountsCarousel from '../components/AccountsCarousel'
import BudgetOverview from '../components/BudgetOverview'
import AllTimeSummary from '../components/AllTimeSummary'
import SpendingChart from '../components/SpendingChart'
import CategoryDonut from '../components/CategoryDonut'
import CategoryBreakdown from '../components/CategoryBreakdown'

export default function DashboardTab({ monthTransactions, transactions = [], monthlyBudget, accounts = [], categories = [], currency = 'USD', onSelectAccount, onSetBudget }) {
  const monthExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <AccountsCarousel accounts={accounts} transactions={transactions} currency={currency} onSelect={onSelectAccount} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {monthlyBudget ? (
            <BudgetOverview
              totals={{ expenses: monthExpenses }}
              monthlyBudget={monthlyBudget}
              currency={currency}
            />
          ) : (
            <div className="p-8 border border-white/5 bg-surface/30 rounded-3xl text-center backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
                <Target size={22} className="text-accent-purple" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">No budget set</h3>
              <p className="text-sm text-text-muted max-w-xs mx-auto mb-5">
                Set a monthly budget to track your spending against it here.
              </p>
              <button
                onClick={onSetBudget}
                className="px-5 py-2.5 bg-accent-purple text-white text-sm font-bold rounded-xl hover:bg-accent-purple/90 transition-colors"
              >
                Set Monthly Budget
              </button>
            </div>
          )}
          <AllTimeSummary transactions={transactions} currency={currency} />
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
