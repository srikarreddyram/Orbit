import BudgetOverview from '../components/BudgetOverview'
import SpendingChart from '../components/SpendingChart'
import CategoryBreakdown from '../components/CategoryBreakdown'

export default function DashboardTab({ totals, monthlyBudget, transactions, categories = [], currency = 'USD' }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 xl:col-span-4 space-y-6">
        <div className="bg-surface/40 rounded-3xl p-6 border border-white/5 shadow-sm backdrop-blur-xl relative overflow-hidden">
          {/* subtle glow behind balance */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-purple/20 blur-[60px] rounded-full pointer-events-none" />
          <BudgetOverview totals={totals} monthlyBudget={monthlyBudget} currency={currency} />
        </div>
        <CategoryBreakdown transactions={transactions} categories={categories} currency={currency} />
      </div>
      
      <div className="lg:col-span-7 xl:col-span-8 min-w-0">
        <SpendingChart transactions={transactions} monthlyBudget={monthlyBudget} currency={currency} />
      </div>
    </div>
  )
}
