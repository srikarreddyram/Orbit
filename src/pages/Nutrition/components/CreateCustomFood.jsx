import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ScanLine, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useCustomData from '../../../hooks/useCustomData'
import { FOOD_UNITS } from '../../../utils/nutritionHelpers'
import { scanNutritionLabel } from '../../../lib/ai'

export default function CreateCustomFood({ isOpen, onClose }) {
  const { addCustomFood } = useCustomData()
  const fileInputRef = useRef(null)
  const [scanning, setScanning] = useState(false)

  const [name, setName] = useState('')
  const [baseAmount, setBaseAmount] = useState('100')
  const [baseUnit, setBaseUnit] = useState('g')
  const [cals, setCals] = useState('')
  const [p, setP] = useState('')
  const [c, setC] = useState('')
  const [sugar, setSugar] = useState('')
  const [f, setF] = useState('')
  const [chol, setChol] = useState('')

  const handleScan = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    setScanning(true)
    try {
      const result = await scanNutritionLabel(file)
      if (!result) {
        toast.error('AI Log is not configured')
        return
      }
      // Only fill in what the label actually gave us — never overwrite with
      // a guess, and never touch a field the user already typed something into.
      if (result.name && !name) setName(result.name)
      if (result.base_amount != null) setBaseAmount(String(result.base_amount))
      if (result.base_unit) setBaseUnit(result.base_unit)
      if (result.calories != null) setCals(String(result.calories))
      if (result.protein_g != null) setP(String(result.protein_g))
      if (result.carbs_g != null) setC(String(result.carbs_g))
      if (result.sugar_g != null) setSugar(String(result.sugar_g))
      if (result.fat_g != null) setF(String(result.fat_g))
      if (result.cholesterol_mg != null) setChol(String(result.cholesterol_mg))
      toast.success('Label scanned — double-check the numbers before saving')
    } catch (err) {
      toast.error(err.message || 'Could not read that label')
    } finally {
      setScanning(false)
    }
  }

  const reset = () => {
    setName('')
    setBaseAmount('100')
    setBaseUnit('g')
    setCals('')
    setP('')
    setC('')
    setSugar('')
    setF('')
    setChol('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !cals || !baseAmount) return

    try {
      await addCustomFood({
        name,
        base_amount: parseFloat(baseAmount),
        base_unit: baseUnit,
        calories: parseInt(cals),
        protein_g: parseFloat(p || 0),
        carbs_g: parseFloat(c || 0),
        sugar_g: parseFloat(sugar || 0),
        fat_g: parseFloat(f || 0),
        cholesterol_mg: parseFloat(chol || 0),
      })
      onClose()
      reset()
      toast.success('Custom food created')
    } catch {
      toast.error('Failed to create food — you may already have one with that name')
    }
  }

  const inputClass = "w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber font-mono-numbers"
  const labelClass = "text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto w-full md:w-[440px] max-h-[90vh] overflow-y-auto bg-elevated border border-white/10 md:rounded-3xl rounded-t-3xl shadow-2xl p-6 md:m-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">New Food</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleScan}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              className="w-full py-3 mb-4 rounded-xl border border-dashed border-accent-amber/40 text-accent-amber font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-amber/10 transition-colors disabled:opacity-60"
            >
              {scanning ? <Loader2 size={16} className="animate-spin" /> : <ScanLine size={16} />}
              {scanning ? 'Reading label…' : 'Scan Nutrition Label'}
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Food Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chicken Breast"
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber"
                />
              </div>

              {/* Base measure — nutrition below is "per" this amount */}
              <div>
                <label className={labelClass}>Nutrition Per</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(e.target.value)}
                    placeholder="100"
                    className={`${inputClass} flex-1`}
                  />
                  <div className="flex gap-1 bg-surface border border-white/10 rounded-xl p-1">
                    {FOOD_UNITS.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setBaseUnit(u.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          baseUnit === u.id ? 'bg-accent-amber text-black' : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-1.5">
                  e.g. "100" + "g" if the label reads nutrition per 100 grams
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Calories</label>
                  <input type="number" value={cals} onChange={(e) => setCals(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Protein (g)</label>
                  <input type="number" value={p} onChange={(e) => setP(e.target.value)} placeholder="0" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Carbs (g)</label>
                  <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sugar (g)</label>
                  <input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)} placeholder="0" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Fat (g)</label>
                  <input type="number" value={f} onChange={(e) => setF(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cholesterol (mg)</label>
                  <input type="number" value={chol} onChange={(e) => setChol(e.target.value)} placeholder="0" className={inputClass} />
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim() || !cals || !baseAmount}
                className="w-full py-4 bg-accent-amber hover:bg-accent-amber/90 text-black font-bold rounded-xl transition-colors mt-4 disabled:opacity-50"
              >
                Save Custom Food
              </button>
            </form>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
