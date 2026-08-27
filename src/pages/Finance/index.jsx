import { useState, useMemo } from 'react'
import { Plus, CreditCard, PieChart, Repeat, List, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useFinance from '../../hooks/useFinance'
import useAuth from '../../hooks/useAuth'

// Main views
import DashboardTab from './tabs/DashboardTab'
import TransactionsTab from './tabs/TransactionsTab'
import AccountsTab from './tabs/AccountsTab'
import BudgetsTab from './tabs/BudgetsTab'
import RecurringTab from './tabs/RecurringTab'

import AddTransactionSheet from './components/AddTransactionSheet'
import CategoryManagerModal from './components/CategoryManagerModal'
import AccountDetail from './components/AccountDetail'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: List },
  { id: 'accounts', label: 'Accounts', icon: CreditCard },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'recurring', label: 'Recurring', icon: Repeat },
]

export default function Finance() {
  const { 
    transactions, budgetLimits, accounts, recurring, categories, isLoading, 
    addTransaction, deleteTransaction, addAccount, addRecurring,
    addCategory, deleteCategory, restoreDefaultCategories, saveBudgetLimit, deleteBudgetLimit
  } = useFinance()
  const { profile } = useAuth()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const monthlyBudget = profile?.monthly_budget || 2500
  const currency = profile?.currency || 'USD'

  // Transactions scoped to the current calendar month, for "This Month" widgets
  const monthTransactions = useMemo(() => {
    const now = new Date()
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return transactions.filter((t) => t.date?.startsWith(prefix))
  }, [transactions])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col">
      {/* Top sticky header for floating action & Title */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Finance
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 bg-accent-purple text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,106,247,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* iOS Style Segmented Control (Tabs) — hidden while drilled into an account */}
      {!selectedAccount && (
        <div className="w-full overflow-x-auto hide-scrollbar mb-6">
          <div className="flex p-1.5 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner w-max min-w-full">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all relative whitespace-nowrap
                    ${isActive ? 'text-white' : 'text-text-muted hover:text-text-secondary'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="finance-active-tab"
                      className="absolute inset-0 bg-elevated rounded-xl shadow-lg border border-white/10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {selectedAccount ? (
          <AccountDetail
            account={selectedAccount}
            transactions={transactions}
            categories={categories}
            deleteTransaction={deleteTransaction}
            currency={currency}
            onBack={() => setSelectedAccount(null)}
          />
        ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardTab
                monthTransactions={monthTransactions}
                transactions={transactions}
                monthlyBudget={monthlyBudget}
                accounts={accounts}
                categories={categories}
                currency={currency}
                onSelectAccount={setSelectedAccount}
              />
            )}
            {activeTab === 'transactions' && (
              <TransactionsTab
                transactions={transactions}
                deleteTransaction={deleteTransaction}
                categories={categories}
                currency={currency}
              />
            )}
            {activeTab === 'accounts' && (
              <AccountsTab
                accounts={accounts}
                addAccount={addAccount}
                transactions={transactions}
                currency={currency}
                onSelectAccount={setSelectedAccount}
              />
            )}
            {activeTab === 'budgets' && (
              <BudgetsTab 
                budgetLimits={budgetLimits} 
                transactions={transactions}
                categories={categories}
                saveBudgetLimit={saveBudgetLimit}
                deleteBudgetLimit={deleteBudgetLimit}
                onManageCategories={() => setShowCategoryModal(true)}
                currency={currency}
              />
            )}
            {activeTab === 'recurring' && (
              <RecurringTab 
                recurring={recurring} 
                addRecurring={addRecurring} 
                categories={categories}
                currency={currency}
              />
            )}
          </motion.div>
        </AnimatePresence>
        )}
      </div>

      <AddTransactionSheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        addTransaction={addTransaction}
        categories={categories}
        accounts={accounts}
        onManageCategories={() => setShowCategoryModal(true)}
        currency={currency}
      />

      <CategoryManagerModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        restoreDefaultCategories={restoreDefaultCategories}
      />
    </div>
  )
}
