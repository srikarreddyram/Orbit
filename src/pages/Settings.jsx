import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Target, Wallet, Sliders, Download, Trash2,
  Save, Keyboard, AlertTriangle,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import useMetrics from '../hooks/useMetrics'
import { exportAllData } from '../utils/exportData'
import { CURRENCIES } from '../utils/currencyHelpers'

const keyboardShortcuts = [
  { key: 'N', action: 'New task' },
  { key: 'W', action: 'Log workout' },
  { key: 'M', action: 'Log meal' },
  { key: 'J', action: 'Open journal' },
  { key: '⌘K', action: 'Command palette' },
]

export default function Settings() {
  const { profile, updateProfile, signOut } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [calorieGoal, setCalorieGoal] = useState(profile?.daily_calorie_goal || 2000)
  const [waterGoal, setWaterGoal] = useState(profile?.daily_water_goal || 8)
  const [workoutGoal, setWorkoutGoal] = useState(profile?.weekly_workout_goal || 4)
  const [monthlyBudget, setMonthlyBudget] = useState(profile?.monthly_budget || 2500)
  const [currency, setCurrency] = useState(profile?.currency || 'USD')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  // LifeScore weights
  const [weights, setWeights] = useState(
    profile?.lifescore_weights || { tasks: 25, workouts: 25, calories: 25, finance: 25 }
  )
  const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0)

  // Metrics hook
  const { metrics, updateMetrics } = useMetrics()
  const [weightKg, setWeightKg] = useState(metrics?.weight_kg || 70)
  const [heightCm, setHeightCm] = useState(metrics?.height_cm || 170)
  const [age, setAge] = useState(metrics?.age || 30)

  const updateWeight = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: parseInt(value) || 0 }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        name,
        daily_calorie_goal: calorieGoal,
        daily_water_goal: waterGoal,
        weekly_workout_goal: workoutGoal,
        monthly_budget: monthlyBudget,
        currency,
        lifescore_weights: weights,
      })
      await updateMetrics({
        weight_kg: weightKg,
        height_cm: heightCm,
        age: age
      })
      toast.success('Settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportAllData()
      toast.success('Data exported')
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-text-muted" />
          <h2 className="text-sm font-medium text-text-secondary">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="input-field opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </Card>

      {/* Body Metrics */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-text-muted" />
          <h2 className="text-sm font-medium text-text-secondary">Body Metrics (For AI Calorie Engine)</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value))}
              className="input-field font-mono-numbers"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value))}
              className="input-field font-mono-numbers"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="input-field font-mono-numbers"
            />
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-text-muted" />
          <h2 className="text-sm font-medium text-text-secondary">Daily Goals</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Calorie Target</label>
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
              className="input-field font-mono-numbers"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Water Goal (glasses)</label>
            <input
              type="number"
              value={waterGoal}
              onChange={(e) => setWaterGoal(parseInt(e.target.value))}
              className="input-field font-mono-numbers"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Weekly Workout Goal</label>
            <input
              type="number"
              value={workoutGoal}
              onChange={(e) => setWorkoutGoal(parseInt(e.target.value))}
              className="input-field font-mono-numbers"
            />
          </div>
        </div>
      </Card>

      {/* Budget */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={16} className="text-text-muted" />
          <h2 className="text-sm font-medium text-text-secondary">Budget</h2>
        </div>
        <div>
          <label className="text-xs text-text-muted mb-1 block">Monthly Budget</label>
          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
            className="input-field font-mono-numbers"
            step="100"
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-text-muted mb-1 block">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input-field cursor-pointer"
          >
            {Object.entries(CURRENCIES).map(([code, config]) => (
              <option key={code} value={code}>
                {config.name} ({config.symbol})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* LifeScore Weights */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-text-muted" />
            <h2 className="text-sm font-medium text-text-secondary">LifeScore Weights</h2>
          </div>
          <span className={`text-xs font-mono-numbers ${totalWeights === 100 ? 'text-accent-green' : 'text-accent-red'}`}>
            Total: {totalWeights}/100
          </span>
        </div>
        <div className="space-y-3">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm text-text-secondary capitalize w-20">{key}</span>
              <input
                type="range"
                min={0}
                max={40}
                value={value}
                onChange={(e) => updateWeight(key, e.target.value)}
                className="flex-1 accent-accent-purple"
              />
              <span className="text-sm font-mono-numbers text-text-primary w-10 text-right">{value}%</span>
            </div>
          ))}
        </div>
        {totalWeights !== 100 && (
          <p className="text-xs text-accent-red mt-2">Weights must sum to 100</p>
        )}
      </Card>

      {/* Keyboard shortcuts */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Keyboard size={16} className="text-text-muted" />
          <h2 className="text-sm font-medium text-text-secondary">Keyboard Shortcuts</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {keyboardShortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-text-secondary">{shortcut.action}</span>
              <kbd className="px-2 py-0.5 bg-surface border border-border rounded text-xs font-mono-numbers text-text-muted">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </Card>

      {/* Save button */}
      <Button
        icon={Save}
        loading={saving}
        onClick={handleSave}
        className="w-full"
      >
        Save Settings
      </Button>

      {/* Data export */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-text-primary">Export Data</h3>
            <p className="text-xs text-text-muted mt-0.5">Download all your data as JSON</p>
          </div>
          <Button variant="secondary" size="sm" icon={Download} loading={exporting} onClick={handleExport}>
            Export
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="!border-accent-red/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-accent-red" />
          <h2 className="text-sm font-medium text-accent-red">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-text-primary">Clear All Data</h3>
            <p className="text-xs text-text-muted">Permanently delete all your tracked data</p>
          </div>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowClearConfirm(true)}>
            Clear Data
          </Button>
        </div>
      </Card>

      {/* Sign out */}
      <Button
        variant="ghost"
        onClick={signOut}
        className="w-full text-text-muted"
      >
        Sign Out
      </Button>

      {/* Confirm dialog */}
      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear All Data?" size="sm">
        <p className="text-sm text-text-secondary mb-4">
          This will permanently delete all your tracked data across all modules. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setShowClearConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              toast.success('All data cleared')
              setShowClearConfirm(false)
            }}
          >
            Delete Everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
