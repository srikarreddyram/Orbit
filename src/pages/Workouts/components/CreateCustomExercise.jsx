import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import useCustomData from '../../../hooks/useCustomData'

export default function CreateCustomExercise({ isOpen, onClose }) {
  const { addCustomExercise } = useCustomData()
  
  const [name, setName] = useState('')
  const [category, setCategory] = useState('strength')
  const [muscle, setMuscle] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await addCustomExercise({
        name,
        category,
        target_muscles: muscle ? [muscle] : [],
        difficulty: 'intermediate'
      })
      onClose()
      setName('')
      setMuscle('')
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

          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="pointer-events-auto w-full md:w-[400px] max-h-[90vh] overflow-y-auto bg-elevated border border-white/10 md:rounded-3xl rounded-t-3xl shadow-2xl p-6 md:m-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">New Exercise</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Exercise Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Banded Hip Thrusts"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="yoga">Yoga</option>
                    <option value="rehab">Rehab / Mobility</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">Target Muscle (Optional)</label>
                  <input
                    type="text"
                    value={muscle}
                    onChange={(e) => setMuscle(e.target.value)}
                    placeholder="e.g. Glutes"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-4 bg-accent-purple hover:bg-accent-purple/90 text-white font-bold rounded-xl transition-colors mt-4 disabled:opacity-50"
                >
                  Save Exercise
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
