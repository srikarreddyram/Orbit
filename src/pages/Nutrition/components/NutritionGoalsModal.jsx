import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import useAuth from '../../../hooks/useAuth'

export default function NutritionGoalsModal({ isOpen, onClose }) {
  const { profile, updateProfile } = useAuth()
  const [calorieGoal, setCalorieGoal] = useState(profile?.daily_calorie_goal || 2000)
  const [proteinGoal, setProteinGoal] = useState(profile?.daily_protein_goal || 120)
  const [waterGoal, setWaterGoal] = useState(profile?.daily_water_goal || 8)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        daily_calorie_goal: calorieGoal,
        daily_protein_goal: proteinGoal,
        daily_water_goal: waterGoal,
      })
      toast.success('Goals updated')
      onClose()
    } catch {
      toast.error('Failed to update goals')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nutrition Goals">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Calorie Target</label>
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
            className="input-field font-mono-numbers"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Protein Target (g)</label>
          <input
            type="number"
            value={proteinGoal}
            onChange={(e) => setProteinGoal(parseInt(e.target.value))}
            className="input-field font-mono-numbers"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Water Goal (glasses)</label>
          <input
            type="number"
            value={waterGoal}
            onChange={(e) => setWaterGoal(parseInt(e.target.value))}
            className="input-field font-mono-numbers"
          />
        </div>
        <Button type="submit" disabled={saving} className="w-full bg-accent-amber text-black py-3 mt-2 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Goals'}
        </Button>
      </form>
    </Modal>
  )
}
