import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Plus, Timer, Dumbbell } from 'lucide-react'
import Button from '../../../components/ui/Button'
import useMetrics from '../../../hooks/useMetrics'
import { estimateWorkoutImpact } from '../../../lib/ai'
import { calculateBurnByMET, DEFAULT_METS } from '../../../utils/fitnessEngine'

export default function ActiveWorkoutOverlay({ workout, onClose, onFinish }) {
  const [elapsed, setElapsed] = useState(0)
  const [exercises, setExercises] = useState([])
  const [isFinishing, setIsFinishing] = useState(false)
  const { metrics } = useMetrics()
  
  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - workout.startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [workout.startTime])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Dummy add exercise
  const addExercise = () => {
    setExercises([
      ...exercises, 
      { id: Date.now(), name: 'Bench Press', sets: [{ id: 1, kg: '', reps: '', completed: false }] }
    ])
  }

  const addSet = (exId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return { ...ex, sets: [...ex.sets, { id: Date.now(), kg: '', reps: '', completed: false }] }
      }
      return ex
    }))
  }

  const updateSet = (exId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        }
      }
      return ex
    }))
  }

  const toggleSet = (exId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
        }
      }
      return ex
    }))
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    
    // Transform state into payload
    const payloadSets = []
    exercises.forEach(ex => {
      // Group completed sets by exercise
      const completedSets = ex.sets.filter(s => s.completed)
      if (completedSets.length > 0) {
        payloadSets.push({
          exercise_name: ex.name,
          sets: completedSets.length,
          reps: parseInt(completedSets[0].reps || 0),
          weight_kg: parseFloat(completedSets[0].kg || 0)
        })
      }
    })

    const durationMinutes = Math.max(1, Math.floor(elapsed / 60))
    
    // Default fallback calculation
    let caloriesBurned = calculateBurnByMET(DEFAULT_METS.weightlifting, metrics?.weight_kg, durationMinutes)
    let aiNotes = 'Custom Workout'

    // Try AI Engine
    const aiEstimate = await estimateWorkoutImpact({ duration_minutes: durationMinutes, sets: payloadSets }, metrics)
    if (aiEstimate) {
      caloriesBurned = aiEstimate.estimated_calories || caloriesBurned
      aiNotes = `AI Feedback: ${aiEstimate.recovery_advice} (Intensity: ${aiEstimate.intensity_score}/10)`
    }

    onFinish({
      type: 'strength',
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      notes: aiNotes,
      logged_at: new Date().toISOString(),
      sets: payloadSets
    })
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-base flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50 backdrop-blur-md">
        <button onClick={onClose} className="p-2 -ml-2 text-text-muted hover:text-text-primary">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 text-accent-purple font-mono-numbers font-bold">
          <Timer size={18} />
          {formatTime(elapsed)}
        </div>
        <button onClick={handleFinish} disabled={isFinishing} className="px-4 py-1.5 bg-accent-purple text-white font-bold rounded-full text-sm hover:bg-accent-purple/90 disabled:opacity-50">
          {isFinishing ? 'Analyzing...' : 'Finish'}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {exercises.map((ex, exIdx) => (
          <div key={ex.id} className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-accent-purple">{ex.name}</h3>
              <button className="text-text-muted text-sm font-semibold hover:text-text-primary">
                Options
              </button>
            </div>
            
            {/* Sets Header */}
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-text-muted">
              <div className="col-span-2 text-center">Set</div>
              <div className="col-span-4 text-center">kg</div>
              <div className="col-span-4 text-center">Reps</div>
              <div className="col-span-2 text-center"><Check size={14} className="mx-auto" /></div>
            </div>

            {/* Sets Rows */}
            <div className="space-y-1 pb-4">
              {ex.sets.map((set, setIdx) => (
                <div 
                  key={set.id} 
                  className={`grid grid-cols-12 px-4 py-1 items-center transition-colors ${
                    set.completed ? 'bg-emerald-500/10' : ''
                  }`}
                >
                  <div className="col-span-2 text-center">
                    <span className={`text-xs font-bold ${set.completed ? 'text-emerald-400' : 'text-text-muted'}`}>
                      {setIdx + 1}
                    </span>
                  </div>
                  <div className="col-span-4 px-1">
                    <input 
                      type="number" 
                      value={set.kg}
                      onChange={(e) => updateSet(ex.id, set.id, 'kg', e.target.value)}
                      placeholder="-"
                      className={`w-full bg-black/20 rounded-lg py-1.5 text-center font-mono-numbers text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent-purple ${
                        set.completed ? 'text-emerald-400 opacity-50 pointer-events-none' : 'text-text-primary'
                      }`} 
                    />
                  </div>
                  <div className="col-span-4 px-1">
                    <input 
                      type="number" 
                      value={set.reps}
                      onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                      placeholder="-"
                      className={`w-full bg-black/20 rounded-lg py-1.5 text-center font-mono-numbers text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent-purple ${
                        set.completed ? 'text-emerald-400 opacity-50 pointer-events-none' : 'text-text-primary'
                      }`} 
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button 
                      onClick={() => toggleSet(ex.id, set.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        set.completed ? 'bg-emerald-500 text-white' : 'bg-surface border border-white/10 text-text-muted hover:bg-white/5'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-4 pb-4">
              <button 
                onClick={() => addSet(ex.id)}
                className="w-full py-2 bg-black/20 hover:bg-black/30 text-text-muted text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                + Add Set
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addExercise}
          className="w-full py-4 text-accent-purple bg-accent-purple/10 hover:bg-accent-purple/20 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Exercise
        </button>
      </div>
    </motion.div>
  )
}
