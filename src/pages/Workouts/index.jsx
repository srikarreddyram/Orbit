import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, History, LineChart, Play } from 'lucide-react'
import useWorkouts from '../../hooks/useWorkouts'
import useAuth from '../../hooks/useAuth'

import HistoryTab from './tabs/HistoryTab'
import StartTab from './tabs/StartTab'
import ExercisesTab from './tabs/ExercisesTab'
import StatsTab from './tabs/StatsTab'
import ActiveWorkoutOverlay from './components/ActiveWorkoutOverlay'

const TABS = [
  { id: 'start', label: 'Workout', icon: Play },
  { id: 'history', label: 'History', icon: History },
  { id: 'exercises', label: 'Exercises', icon: Dumbbell },
  { id: 'stats', label: 'Stats', icon: LineChart },
]

export default function Workouts() {
  const { workouts, personalRecords, isLoading, logWorkout } = useWorkouts()
  const { profile } = useAuth()
  
  const [activeTab, setActiveTab] = useState('start')
  const [activeWorkout, setActiveWorkout] = useState(null)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
      </div>
    )
  }

  const startEmptyWorkout = () => {
    setActiveWorkout({
      startTime: new Date(),
      exercises: [],
    })
  }

  const finishWorkout = async (workoutData) => {
    try {
      await logWorkout(workoutData)
      setActiveWorkout(null)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col">
      {/* Top sticky header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Workouts
        </h1>
      </div>

      {/* iOS Style Segmented Control (Tabs) */}
      <div className="w-full overflow-x-auto hide-scrollbar mb-6">
        <div className="flex p-1.5 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner w-max min-w-full">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all relative whitespace-nowrap
                  ${isActive ? 'text-white' : 'text-text-muted hover:text-text-secondary'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="workouts-active-tab"
                    className="absolute inset-0 bg-elevated rounded-xl shadow-lg border border-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'start' && <StartTab onStart={startEmptyWorkout} />}
            {activeTab === 'history' && <HistoryTab workouts={workouts} />}
            {activeTab === 'exercises' && <ExercisesTab />}
            {activeTab === 'stats' && <StatsTab workouts={workouts} prs={personalRecords} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Active Workout Overlay (like Hevy / Strong) */}
      <AnimatePresence>
        {activeWorkout && (
          <ActiveWorkoutOverlay
            workout={activeWorkout}
            onClose={() => setActiveWorkout(null)}
            onFinish={finishWorkout}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
