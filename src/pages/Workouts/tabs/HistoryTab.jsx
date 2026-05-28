import { Clock, Trophy, Dumbbell } from 'lucide-react'
import { formatRelativeDate } from '../../../utils/dateHelpers'

export default function HistoryTab({ workouts }) {
  if (!workouts || workouts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-sm">No workouts logged yet. Go to the Workout tab to start one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {workouts.map((workout) => {
        const totalVolume = workout.sets 
          ? workout.sets.reduce((sum, s) => sum + (s.sets || 0) * (s.reps || 0) * (s.weight_kg || 0), 0) 
          : 0

        const totalSets = workout.sets
          ? workout.sets.reduce((sum, s) => sum + (s.sets || 0), 0)
          : 0

        return (
          <div key={workout.id} className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <span className="text-xl">💪</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">{workout.notes || 'Workout Session'}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{formatRelativeDate(workout.logged_at)}</p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="flex px-5 py-4 gap-6">
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-text-muted" />
                <span className="text-sm font-semibold text-text-secondary">{workout.duration_minutes}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Dumbbell size={16} className="text-text-muted" />
                <span className="text-sm font-semibold text-text-secondary">{totalVolume.toLocaleString()} kg</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-text-muted" />
                <span className="text-sm font-semibold text-text-secondary">0 PRs</span>
              </div>
            </div>

            {/* Sets summary */}
            {workout.sets && workout.sets.length > 0 && (
              <div className="px-5 pb-5">
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-12 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-2">
                    <div className="col-span-8">Exercise</div>
                    <div className="col-span-4 text-right">Best Set</div>
                  </div>
                  {workout.sets.map((set, idx) => (
                    <div key={idx} className="grid grid-cols-12 text-sm px-2 py-1 items-center hover:bg-white/5 rounded-lg transition-colors">
                      <div className="col-span-8 font-medium text-text-primary">
                        <span className="text-text-muted mr-2">{set.sets}x</span>
                        {set.exercise_name}
                      </div>
                      <div className="col-span-4 text-right font-mono-numbers text-text-secondary">
                        {set.weight_kg} kg x {set.reps}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
