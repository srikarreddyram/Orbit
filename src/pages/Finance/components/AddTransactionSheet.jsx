import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { getIconComponent } from './CategoryConfig'
import toast from 'react-hot-toast'
import { getCurrencySymbol } from '../../../utils/currencyHelpers'
import { getToday } from '../../../utils/dateHelpers'
import { Plus, Calendar } from 'lucide-react'

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export default function AddTransactionSheet({ isOpen, onClose, addTransaction, categories = [], onManageCategories, currency = 'USD' }) {
  const [txType, setTxType] = useState('expense')
  const [txAmount, setTxAmount] = useState('')
  const [txCategory, setTxCategory] = useState('')
  const [txNote, setTxNote] = useState('')
  const [txDate, setTxDate] = useState(getToday())
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Filter categories by type, falling back to the first available option
  // whenever the explicitly-selected one isn't valid for the current type.
  const availableCategories = categories.filter(c => c.type === txType)
  const effectiveCategory = availableCategories.find(c => c.name === txCategory)?.name || availableCategories[0]?.name || ''

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!txAmount || parseFloat(txAmount) <= 0) return
    if (!effectiveCategory) {
      toast.error('Please create a category first')
      return
    }

    const tx = {
      type: txType,
      amount: parseFloat(txAmount),
      category: effectiveCategory,
      note: txNote,
      date: txDate,
    }

    try {
      await addTransaction(tx)
      setTxAmount('')
      setTxNote('')
      setTxDate(getToday())
      // Keep category and type as they were for quick multi-add
      onClose()
      toast.success(`${txType === 'income' ? 'Income' : 'Expense'} logged!`)
    } catch {
      toast.error('Failed to log transaction')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Transaction">
      <form onSubmit={handleAdd} className="space-y-6">
        
        {/* Type Segmented Control */}
        <div className="flex p-1 bg-surface rounded-xl border border-border">
          {['expense', 'income'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTxType(type)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize relative
                ${txType === type ? 'text-white' : 'text-text-muted hover:text-text-secondary'}
              `}
            >
              {txType === type && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-elevated rounded-lg shadow-sm border border-white/5"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{type}</span>
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <div className="text-center py-6 bg-surface/50 rounded-2xl border border-border/50">
          <label className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-2">Amount</label>
          <div className="flex items-center justify-center gap-1">
            <span className={`text-4xl font-light ${txType === 'income' ? 'text-emerald-400' : 'text-text-secondary'}`}>{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              placeholder="0.00"
              className={`bg-transparent border-none text-5xl font-bold font-mono-numbers text-center w-48 focus:outline-none placeholder-text-muted/30 ${
                txType === 'income' ? 'text-emerald-400' : 'text-text-primary'
              }`}
              autoFocus
              required
              step="0.01"
              min="0.01"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-wider text-text-muted font-bold">Category</label>
            <button 
              type="button"
              onClick={onManageCategories}
              className="text-xs font-bold text-accent-purple hover:text-accent-purple/80 transition-colors"
            >
              Manage Categories
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto hide-scrollbar p-1 -m-1">
            {availableCategories.map((cat) => {
              const Icon = getIconComponent(cat.icon)
              const isSelected = effectiveCategory === cat.name
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTxCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-2xl transition-all duration-200
                    ${isSelected
                      ? 'bg-elevated ring-1 ring-white/10 shadow-lg scale-105'
                      : 'bg-surface hover:bg-surface/80'
                    }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: isSelected ? cat.color : `${cat.color}15`,
                      color: isSelected ? '#fff' : cat.color
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight px-1 capitalize ${
                    isSelected ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              )
            })}
            
            <button
              type="button"
              onClick={onManageCategories}
              className="flex flex-col items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-200 bg-surface/50 border border-dashed border-white/10 hover:border-accent-purple/50 hover:bg-accent-purple/5"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted">
                <Plus size={18} />
              </div>
              <span className="text-[10px] font-medium text-center leading-tight px-1 text-text-muted">
                New
              </span>
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-2">Date</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Today', value: getToday() },
              { label: 'Yesterday', value: yesterday() },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => { setTxDate(opt.value); setShowDatePicker(false) }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  txDate === opt.value && !showDatePicker
                    ? 'bg-accent-purple text-white'
                    : 'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                showDatePicker || (txDate !== getToday() && txDate !== yesterday())
                  ? 'bg-accent-purple text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <Calendar size={13} />
              {showDatePicker || (txDate !== getToday() && txDate !== yesterday()) ? txDate : 'Custom'}
            </button>
          </div>
          {showDatePicker && (
            <input
              type="date"
              value={txDate}
              max={getToday()}
              onChange={(e) => setTxDate(e.target.value || getToday())}
              className="input-field mt-2 text-sm"
            />
          )}
        </div>

        {/* Note */}
        <div>
           <label className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-2">Note (Optional)</label>
          <input
            type="text"
            value={txNote}
            onChange={(e) => setTxNote(e.target.value)}
            placeholder="e.g. Grocery store, Uber ride..."
            className="input-field text-sm bg-surface/50 border-border/50 py-3 rounded-xl focus:bg-elevated"
          />
        </div>

        <Button 
          type="submit" 
          disabled={!effectiveCategory}
          className="w-full py-4 text-base font-bold shadow-lg disabled:opacity-50"
          style={{
            backgroundColor: txType === 'income' ? '#38BDF8' : '#7C3AED',
            color: '#fff'
          }}
        >
          Add {txType === 'income' ? 'Income' : 'Expense'}
        </Button>
      </form>
    </Modal>
  )
}
