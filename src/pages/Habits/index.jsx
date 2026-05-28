import { useState } from 'react'
import { Plus, Settings } from 'lucide-react'
import useHabits from '../../hooks/useHabits'
import HabitCircle from './components/HabitCircle'
import AddHabitModal from './components/AddHabitModal'

export default function Habits() {
  const { habits, completions, isLoading, addHabit, toggleCompletion } = useHabits()
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-amber border-t-transparent animate-spin" />
      </div>
    )
  }

  // Calculate streaks (simplified for demo)
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto pb-24">
      {/* Top sticky header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Habits
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 bg-accent-amber/10 text-accent-amber rounded-full flex items-center justify-center hover:bg-accent-amber/20 transition-all"
          >
            <Plus size={20} />
          </button>
          <button className="w-10 h-10 bg-surface/50 text-text-muted rounded-full flex items-center justify-center hover:text-white transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="py-32 text-center flex flex-col items-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">No habits yet</h3>
          <p className="text-text-muted">Create a habit to start building your streak.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-2 bg-accent-amber text-black font-bold rounded-full hover:bg-accent-amber/90 transition-all"
          >
            Add New Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
          {habits.map((habit) => {
            const isCompletedToday = completions.some(
              c => c.habit_id === habit.id && c.completed_on.startsWith(todayStr)
            )

            // Extremely simplified streak logic for the UI clone feel
            let streak = 0
            if (isCompletedToday) streak = 1

            return (
              <HabitCircle 
                key={habit.id} 
                habit={habit} 
                isCompleted={isCompletedToday}
                streak={streak}
                onToggle={async () => {
                  await toggleCompletion({
                    habitId: habit.id,
                    date: todayStr,
                    isCompleted: isCompletedToday
                  })
                }}
              />
            )
          })}
        </div>
      )}

      <AddHabitModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        addHabit={addHabit}
      />
    </div>
  )
}
