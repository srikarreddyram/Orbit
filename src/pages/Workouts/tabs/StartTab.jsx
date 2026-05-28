import { useState } from 'react'
import { Plus, Play, LayoutTemplate } from 'lucide-react'
import useCustomData from '../../../hooks/useCustomData'
import CreateCustomExercise from '../components/CreateCustomExercise'

export default function StartTab({ startWorkout }) {
  const { customExercises } = useCustomData()
  const [showCustomModal, setShowCustomModal] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Quick Start Card */}
      <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-accent-purple/20 transition-colors duration-500" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Empty Workout</h2>
          <p className="text-text-muted mb-6">Start from scratch and build as you go.</p>
          
          <button 
            onClick={startWorkout}
            className="w-full py-4 bg-accent-purple hover:bg-accent-purple/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.5)]"
          >
            <Play size={20} fill="currentColor" />
            Start Empty Workout
          </button>
        </div>
      </div>

      {/* Custom Exercises Section */}
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Your Exercises</h3>
          <button 
            onClick={() => setShowCustomModal(true)}
            className="text-accent-purple text-sm font-bold flex items-center gap-1 hover:text-white transition-colors"
          >
            <Plus size={16} /> New Exercise
          </button>
        </div>
        
        <div className="space-y-3">
          {customExercises?.length === 0 ? (
            <p className="text-text-muted text-sm px-2">No custom exercises yet.</p>
          ) : (
            customExercises?.slice(0, 3).map(ex => (
              <div key={ex.id} className="bg-surface/20 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-white text-lg">{ex.name}</h4>
                  <p className="text-xs text-text-muted uppercase tracking-wider mt-1">{ex.muscle_group}</p>
                </div>
                <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Routines List */}
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">My Routines</h3>
          <button className="text-accent-purple text-sm font-bold flex items-center gap-1 hover:text-white transition-colors">
            <Plus size={16} /> New Routine
          </button>
        </div>

        <div className="p-8 border border-white/5 bg-surface/20 rounded-2xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center mb-3">
            <LayoutTemplate size={20} className="text-accent-purple" />
          </div>
          <p className="text-sm text-text-primary font-bold">No routines yet</p>
          <p className="text-xs text-text-muted mt-1">Create a routine to quickly start your favorite workouts.</p>
        </div>
      </div>

      {showCustomModal && <CreateCustomExercise onClose={() => setShowCustomModal(false)} />}
    </div>
  )
}
