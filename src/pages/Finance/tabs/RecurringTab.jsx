import { useState, useEffect } from 'react'
import { Calendar, Repeat, Plus } from 'lucide-react'
import { getCurrencySymbol, formatCurrency } from '../../../utils/currencyHelpers'
import { getIconComponent } from '../components/CategoryConfig'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'

export default function RecurringTab({ recurring = [], addRecurring, categories = [], currency = 'USD' }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [frequency, setFrequency] = useState('monthly')
  const [nextDate, setNextDate] = useState('')

  const expenseCategories = categories.filter(c => c.type === 'expense')

  useEffect(() => {
    if (expenseCategories.length > 0 && !category) {
      setCategory(expenseCategories[0].name)
    }
  }, [expenseCategories, category])

  // Calculate monthly total. (Assuming all are monthly for simplicity of MVP, 
  // but let's do a basic conversion if not monthly)
  const totalMonthly = recurring.reduce((sum, sub) => {
    const amt = Number(sub.amount)
    if (sub.frequency === 'yearly') return sum + (amt / 12)
    if (sub.frequency === 'weekly') return sum + (amt * 4.33)
    return sum + amt
  }, 0)
  
  const totalYearly = totalMonthly * 12

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    if (!category) {
      toast.error('Please create an expense category first')
      return
    }

    try {
      await addRecurring({
        name,
        amount: parseFloat(amount),
        category,
        frequency,
        next_date: nextDate || null,
        is_active: true
      })
      setShowAddModal(false)
      setName('')
      setAmount('')
      toast.success('Subscription added')
    } catch (err) {
      toast.error('Failed to add subscription')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
      
      {/* Subscriptions Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md">
          <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Monthly Fixed</p>
          <p className="text-3xl font-bold font-mono-numbers text-text-primary">
            {formatCurrency(totalMonthly, currency)}
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md">
          <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Yearly Projection</p>
          <p className="text-3xl font-bold font-mono-numbers text-text-primary">
            {formatCurrency(totalYearly, currency)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-xl font-bold">Upcoming Bills</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="text-xs font-semibold text-accent-purple hover:text-accent-purple/80 transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Add Bill
        </button>
      </div>

      {recurring.length === 0 ? (
        <div className="p-8 border border-white/5 bg-surface/30 rounded-3xl text-center backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
            <Repeat size={24} className="text-accent-purple" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No recurring bills</h3>
          <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
            Track your subscriptions and fixed expenses to project your monthly cash flow.
          </p>
          <Button onClick={() => setShowAddModal(true)} className="bg-accent-purple text-white px-6">
            Add First Bill
          </Button>
        </div>
      ) : (
        <div className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden shadow-sm backdrop-blur-md">
          {recurring.sort((a,b) => new Date(a.next_date) - new Date(b.next_date)).map((sub, index) => {
            const catObj = categories.find(c => c.name === sub.category)
            const color = catObj ? catObj.color : '#94a3b8'
            const Icon = getIconComponent(catObj ? catObj.icon : 'Package')
            const date = sub.next_date ? new Date(sub.next_date) : null
            
            return (
              <div 
                key={sub.id}
                className={`flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors ${
                  index !== recurring.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-base">{sub.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {date && (
                        <>
                          <Calendar size={12} className="text-text-muted" />
                          <span className="text-xs font-semibold text-text-muted">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                          </span>
                        </>
                      )}
                      <span className="text-[10px] uppercase tracking-wider text-text-muted bg-white/5 px-2 py-0.5 rounded-full ml-1">
                        {sub.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono-numbers text-text-primary">
                    {formatCurrency(sub.amount, currency)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Subscription Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Bill/Subscription">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Netflix, Rent"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">{getCurrencySymbol(currency)}</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-field pl-8"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="input-field cursor-pointer capitalize"
                required
              >
                {expenseCategories.length === 0 ? (
                  <option value="" disabled>No categories available</option>
                ) : (
                  expenseCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input-field cursor-pointer">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </select>
            </div>
          </div>
          <div>
             <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Next Billing Date</label>
             <input
              type="date"
              value={nextDate}
              onChange={e => setNextDate(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <Button type="submit" disabled={!category} className="w-full bg-accent-purple text-white py-3 mt-2 disabled:opacity-50">
            Save Subscription
          </Button>
        </form>
      </Modal>
    </div>
  )
}
