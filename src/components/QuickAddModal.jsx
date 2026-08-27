import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckSquare, Dumbbell, UtensilsCrossed, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const addOptions = [
  { id: 'task', label: 'Task', icon: CheckSquare, path: '/tasks', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  { id: 'workout', label: 'Workout', icon: Dumbbell, path: '/workouts', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
  { id: 'meal', label: 'Meal', icon: UtensilsCrossed, path: '/nutrition', color: 'text-accent-green', bg: 'bg-accent-green/10' },
  { id: 'transaction', label: 'Expense', icon: Wallet, path: '/finance', color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
]

export default function QuickAddModal() {
  const { quickAddOpen, closeQuickAdd } = useStore()
  const navigate = useNavigate()

  const handleSelect = (path) => {
    closeQuickAdd()
    navigate(path)
  }

  return (
    <AnimatePresence>
      {quickAddOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickAdd}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl pointer-events-auto relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Quick Add</h2>
                <button 
                  onClick={closeQuickAdd}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {addOptions.map(option => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.path)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-elevated border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.bg} ${option.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="font-semibold text-text-primary">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
