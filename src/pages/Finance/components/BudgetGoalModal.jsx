import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import useAuth from '../../../hooks/useAuth'
import { getCurrencySymbol } from '../../../utils/currencyHelpers'

export default function BudgetGoalModal({ isOpen, onClose, currency = 'USD' }) {
  const { profile, updateProfile } = useAuth()
  const [monthlyBudget, setMonthlyBudget] = useState(profile?.monthly_budget || 2500)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ monthly_budget: monthlyBudget })
      toast.success('Budget updated')
      onClose()
    } catch {
      toast.error('Failed to update budget')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Monthly Budget">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Monthly Budget</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">{getCurrencySymbol(currency)}</span>
            <input
              type="number"
              step="100"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
              className="input-field font-mono-numbers pl-8"
            />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="w-full bg-accent-purple text-white py-3 mt-2 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Budget'}
        </Button>
      </form>
    </Modal>
  )
}
