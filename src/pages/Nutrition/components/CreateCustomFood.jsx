import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import useCustomData from '../../../hooks/useCustomData'

export default function CreateCustomFood({ isOpen, onClose }) {
  const { addCustomFood } = useCustomData()
  
  const [name, setName] = useState('')
  const [serving, setServing] = useState('')
  const [cals, setCals] = useState('')
  const [p, setP] = useState('')
  const [c, setC] = useState('')
  const [f, setF] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !cals) return

    try {
      await addCustomFood({
        name,
        serving_size: serving || '1 serving',
        calories: parseInt(cals),
        protein_g: parseFloat(p || 0),
        carbs_g: parseFloat(c || 0),
        fat_g: parseFloat(f || 0),
      })
      onClose()
      setName('')
      setServing('')
      setCals('')
      setP('')
      setC('')
      setF('')
    } catch (err) {
      console.error(err)
    }
  }

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

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[70] w-full md:w-[400px] bg-elevated border border-white/10 md:rounded-3xl rounded-t-3xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">New Food</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Food Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Protein Shake"
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Serving</label>
                  <input 
                    type="text" 
                    value={serving}
                    onChange={(e) => setServing(e.target.value)}
                    placeholder="e.g. 1 scoop"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Calories</label>
                  <input 
                    type="number" 
                    value={cals}
                    onChange={(e) => setCals(e.target.value)}
                    placeholder="0"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Protein (g)</label>
                  <input 
                    type="number" 
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                    placeholder="0"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    placeholder="0"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Fat (g)</label>
                  <input 
                    type="number" 
                    value={f}
                    onChange={(e) => setF(e.target.value)}
                    placeholder="0"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-amber font-mono-numbers"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!name.trim() || !cals}
                className="w-full py-4 bg-accent-amber hover:bg-accent-amber/90 text-black font-bold rounded-xl transition-colors mt-4 disabled:opacity-50"
              >
                Save Custom Food
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
