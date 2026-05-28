import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useMood from '../../hooks/useMood'
import AddMoodOverlay from './components/AddMoodOverlay'
import MoodHistory from './components/MoodHistory'
import YearInPixels from './components/YearInPixels'

export default function Mood() {
  const { moodLogs, isLoading, logMood } = useMood()
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-pink border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col max-w-2xl mx-auto pb-24">
      {/* Top sticky header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Mood
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 bg-accent-pink/10 text-accent-pink rounded-full flex items-center justify-center hover:bg-accent-pink/20 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <MoodHistory logs={moodLogs} />
      
      <YearInPixels logs={moodLogs} />

      {/* Floating Add Button for Mobile */}
      <div className="fixed bottom-24 right-6 md:hidden z-40">
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-accent-pink text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddMoodOverlay 
            onClose={() => setShowAddModal(false)}
            addMoodLog={logMood}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
