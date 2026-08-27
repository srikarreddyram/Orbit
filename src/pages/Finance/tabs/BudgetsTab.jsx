import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Plus, Trash2, Edit2, X, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../../../utils/currencyHelpers'
import { getIconComponent } from '../components/CategoryConfig'

export default function BudgetsTab({ 
  budgetLimits = [], 
  transactions = [], 
  categories = [], 
  saveBudgetLimit, 
  deleteBudgetLimit, 
  onManageCategories,
  currency = 'USD' 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLimit, setEditingLimit] = useState(null)
  
  // Form State
  const [selectedCategory, setSelectedCategory] = useState('')
  const [limitAmount, setLimitAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Only show expenses categories for budgets
  const expenseCategories = categories.filter(c => c.type === 'expense')

  const budgets = useMemo(() => {
    return budgetLimits.map(limit => {
      // Find the custom category object for color/icon
      const catObj = categories.find(c => c.name === limit.category)
      const color = catObj ? catObj.color : '#6E6877'
      const iconName = catObj ? catObj.icon : 'Package'

      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === limit.category)
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        ...limit,
        spent,
        percentage: limit.monthly_limit > 0 ? Math.min((spent / limit.monthly_limit) * 100, 100) : 100,
        isOver: spent > limit.monthly_limit,
        color,
        iconName
      }
    }).sort((a, b) => b.percentage - a.percentage)
  }, [budgetLimits, transactions, categories])

  const handleOpenAdd = () => {
    setSelectedCategory(expenseCategories[0]?.name || '')
    setLimitAmount('')
    setEditingLimit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (budget) => {
    setSelectedCategory(budget.category)
    setLimitAmount(budget.monthly_limit.toString())
    setEditingLimit(budget)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this budget limit?')) {
      await deleteBudgetLimit(id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCategory || !limitAmount) return
    
    setIsSubmitting(true)
    try {
      await saveBudgetLimit({
        category: selectedCategory,
        monthly_limit: parseFloat(limitAmount)
      })
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between px-2 mb-2">
        <div>
          <h2 className="text-xl font-bold">Category Budgets</h2>
          <p className="text-sm text-text-muted mt-1">This month's spending limits</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onManageCategories}
            className="flex items-center gap-2 px-4 py-2 bg-surface/50 border border-white/5 text-text-secondary font-bold rounded-xl hover:bg-surface transition-colors"
          >
            <span className="hidden sm:inline">Categories</span>
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-accent-purple/10 text-accent-purple font-bold rounded-xl hover:bg-accent-purple/20 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Budget</span>
          </button>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="p-8 border border-white/5 bg-surface/30 rounded-3xl text-center backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
            <PieChart size={24} className="text-accent-purple" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No budgets set</h3>
          <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
            You haven't set any category budgets yet. Create one to keep your spending in check.
          </p>
          <button 
            onClick={handleOpenAdd}
            className="px-6 py-3 bg-accent-purple text-white font-bold rounded-xl hover:bg-accent-purple/90 transition-colors"
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {budgets.map((budget, index) => {
            const Icon = getIconComponent(budget.iconName)
            const color = budget.color
            const isOver = budget.isOver

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={budget.id}
                className="p-5 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary capitalize">{budget.category}</h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        {isOver ? 'Over budget' : `${(100 - budget.percentage).toFixed(0)}% remaining`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-bold font-mono-numbers ${isOver ? 'text-accent-red' : 'text-text-primary'}`}>
                          {formatCurrency(budget.spent, currency)}
                        </span>
                        <span className="text-sm font-mono-numbers text-text-muted">/ {formatCurrency(budget.monthly_limit, currency)}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons (appear on hover on desktop) */}
                    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => handleOpenEdit(budget)} className="p-2 text-text-muted hover:text-white rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(budget.id)} className="p-2 text-text-muted hover:text-red-400 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-elevated rounded-full overflow-hidden shadow-inner relative z-10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${budget.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`absolute top-0 left-0 h-full rounded-full ${
                      isOver ? 'bg-accent-red' : ''
                    }`}
                    style={{
                      backgroundColor: isOver ? '#B91C1C' : color,
                      boxShadow: `0 0 10px ${isOver ? '#B91C1C' : color}80`
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-full max-w-[400px] bg-base border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              >
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-surface/50">
                  <h2 className="text-xl font-bold text-white">
                    {editingLimit ? 'Edit Budget' : 'Add Budget'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {expenseCategories.length === 0 ? (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col gap-3 text-amber-200">
                      <div className="flex gap-3">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm">You don't have any expense categories yet. Please add a category first.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false)
                          onManageCategories?.()
                        }}
                        className="self-end px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-bold rounded-lg transition-colors"
                      >
                        Create Category
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase">Category</label>
                        <select 
                          required
                          value={selectedCategory}
                          onChange={e => setSelectedCategory(e.target.value)}
                          disabled={!!editingLimit} // Can't change category of existing budget
                          className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple capitalize disabled:opacity-50"
                        >
                          <option value="" disabled>Select Category</option>
                          {expenseCategories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase">Monthly Limit ({currency})</label>
                        <input 
                          type="number" 
                          required
                          step="0.01"
                          min="1"
                          value={limitAmount}
                          onChange={e => setLimitAmount(e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple font-mono-numbers"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 rounded-xl font-bold text-text-primary bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || expenseCategories.length === 0}
                      className="flex-1 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Budget'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
