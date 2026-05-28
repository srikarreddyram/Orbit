import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Frown, Meh, Smile, Laugh, Angry, Briefcase, Users, Gamepad2, Book, Heart, Coffee, Sun } from 'lucide-react'

export const MOOD_CONFIG = {
  1: { label: 'Awful', icon: Angry, color: '#ef4444' },
  2: { label: 'Bad', icon: Frown, color: '#f59e0b' },
  3: { label: 'Meh', icon: Meh, color: '#a8a29e' },
  4: { label: 'Good', icon: Smile, color: '#34d399' },
  5: { label: 'Rad', icon: Laugh, color: '#3b82f6' },
}

const ACTIVITIES = [
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'reading', label: 'Reading', icon: Book },
  { id: 'date', label: 'Date', icon: Heart },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'outside', label: 'Outside', icon: Sun },
]

export default function AddMoodOverlay({ onClose, addMoodLog }) {
  const [score, setScore] = useState(3)
  const [selectedActivities, setSelectedActivities] = useState([])

  const toggleActivity = (id) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    await addMoodLog({
      mood: score,
      note: selectedActivities.join(', ')
    })
    onClose()
  }

  const activeConfig = MOOD_CONFIG[score]

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-base flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <button onClick={onClose} className="p-2 -ml-2 text-text-muted hover:text-white">
          <X size={24} />
        </button>
        <span className="font-bold text-white">How are you?</span>
        <button onClick={handleSubmit} className="p-2 -mr-2 text-accent-pink hover:text-white">
          <Check size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        {/* Mood Selection (Daylio style slider/faces) */}
        <h2 className="text-3xl font-bold mb-8 transition-colors duration-300" style={{ color: activeConfig.color }}>
          {activeConfig.label}
        </h2>

        <div className="flex justify-between w-full max-w-sm mb-16 relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 z-0" />
          
          {[1, 2, 3, 4, 5].map((s) => {
            const config = MOOD_CONFIG[s]
            const Icon = config.icon
            const isSelected = score === s

            return (
              <button
                key={s}
                onClick={() => setScore(s)}
                className={`relative z-10 transition-all duration-300 rounded-full flex items-center justify-center ${
                  isSelected ? 'scale-150 shadow-xl' : 'scale-100 opacity-50 hover:opacity-100 hover:scale-110'
                }`}
                style={{ 
                  backgroundColor: isSelected ? config.color : '#1e1e2e',
                  color: isSelected ? '#ffffff' : config.color,
                  width: isSelected ? '56px' : '40px',
                  height: isSelected ? '56px' : '40px',
                }}
              >
                <Icon size={isSelected ? 32 : 24} />
              </button>
            )
          })}
        </div>

        {/* Activities Grid */}
        <div className="w-full max-w-sm">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 text-center">
            What have you been up to?
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {ACTIVITIES.map(act => {
              const Icon = act.icon
              const isSelected = selectedActivities.includes(act.id)
              
              return (
                <button
                  key={act.id}
                  onClick={() => toggleActivity(act.id)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${
                    isSelected ? 'bg-white/10 scale-110' : 'hover:bg-white/5'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: isSelected ? activeConfig.color : '#1e1e2e',
                      color: isSelected ? '#ffffff' : '#6b6b8a'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-text-muted'}`}>
                    {act.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
