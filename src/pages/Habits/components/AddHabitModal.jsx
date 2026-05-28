import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6']
const ICONS = ['💧', '🏃', '📚', '🧘', '🚭', '🍎', '💻', '🎸']

export default function AddHabitModal({ isOpen, onClose, addHabit }) {
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('💧')
  const [selectedColor, setSelectedColor] = useState('#f59e0b')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    await addHabit({
      name,
      icon: selectedIcon,
      color: selectedColor,
      frequency: 'daily'
    })
    
    setName('')
    onClose()
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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-[450px] bg-elevated border border-white/10 md:rounded-3xl rounded-t-3xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Habit</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Drink Water"
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-accent-amber transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-3">Icon</label>
                <div className="grid grid-cols-4 gap-3">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                        selectedIcon === icon ? 'bg-white/10 scale-110' : 'bg-surface hover:bg-white/5'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-3">Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 rounded-xl transition-all border-2 ${
                        selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={!name.trim()}
                className="w-full py-4 bg-accent-amber hover:bg-accent-amber/90 text-black disabled:opacity-50 font-bold rounded-xl transition-colors mt-8"
              >
                Create Habit
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
