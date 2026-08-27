import { useState } from 'react'
import { Building2, CreditCard, Landmark, Plus, Wallet } from 'lucide-react'
import { getCurrencySymbol, formatCurrency } from '../../../utils/currencyHelpers'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'

export default function AccountsTab({ accounts = [], addAccount, currency = 'USD' }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('checking')
  const [balance, setBalance] = useState('')
  const [color, setColor] = useState('#2E3A6B')

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + Number(a.balance), 0)
  const totalLiabilities = accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + Math.abs(Number(a.balance)), 0)
  const netWorth = totalAssets - totalLiabilities

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await addAccount({
        name,
        type,
        balance: parseFloat(balance) || 0,
        color,
        currency
      })
      setShowAddModal(false)
      setName('')
      setBalance('')
      toast.success('Account added')
    } catch {
      toast.error('Failed to add account')
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Net Worth Hero */}
      <div className="text-center py-10">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Net Worth</h2>
        <div className="text-5xl font-bold font-mono-numbers text-text-primary">
          {formatCurrency(netWorth, currency)}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <span className="text-xs text-text-muted uppercase tracking-wider font-bold block mb-1">Assets</span>
            <span className="text-lg font-mono-numbers text-emerald-400 font-semibold">{formatCurrency(totalAssets, currency)}</span>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div className="text-center">
            <span className="text-xs text-text-muted uppercase tracking-wider font-bold block mb-1">Debt</span>
            <span className="text-lg font-mono-numbers text-accent-red font-semibold">{formatCurrency(totalLiabilities, currency)}</span>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold">Your Accounts</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-xs font-semibold text-accent-purple hover:text-accent-purple/80 transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Add Account
          </button>
        </div>
        
        {accounts.length === 0 ? (
          <div className="p-8 border border-white/5 bg-surface/30 rounded-3xl text-center backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
              <Wallet size={24} className="text-accent-purple" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No accounts yet</h3>
            <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
              Add your checking, credit cards, or investment accounts to track your net worth in one place.
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-accent-purple text-white px-6">
              Add First Account
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => {
              const Icon = account.type === 'checking' || account.type === 'savings' ? Building2
                : account.type === 'credit' ? CreditCard
                : account.type === 'cash' ? Wallet
                : Landmark
              
              return (
                <div 
                  key={account.id}
                  className="group p-5 rounded-3xl border border-white/5 bg-surface/40 hover:bg-surface/80 transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl"
                >
                  <div 
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                    style={{ backgroundColor: account.color }}
                  />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-elevated border border-white/10 flex items-center justify-center shadow-sm">
                        <Icon size={18} style={{ color: account.color }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary leading-tight">{account.name}</h4>
                        <p className="text-xs text-text-muted mt-0.5 capitalize">{account.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <span className="text-sm font-mono-numbers text-text-muted"></span>
                    <span className={`text-2xl font-bold font-mono-numbers ${
                      account.balance < 0 ? 'text-accent-red' : 'text-text-primary'
                    }`}>
                      {formatCurrency(account.balance, currency)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Account">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Account Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Chase Checking"
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="input-field cursor-pointer">
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit Card</option>
                <option value="investment">Investment</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Color Code</label>
              <div className="flex gap-2">
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded-xl bg-transparent border-0 p-0 cursor-pointer" />
                <input type="text" value={color} onChange={e => setColor(e.target.value)} className="input-field flex-1" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Current Balance</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">{getCurrencySymbol(currency)}</span>
              <input
                type="number"
                step="0.01"
                value={balance}
                onChange={e => setBalance(e.target.value)}
                placeholder="0.00"
                className="input-field pl-8"
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1">Use negative values for debt (e.g. Credit Cards)</p>
          </div>
          <Button type="submit" className="w-full bg-accent-purple text-white py-3 mt-2">
            Save Account
          </Button>
        </form>
      </Modal>
    </div>
  )
}
