import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function SleepStages({ log }) {
  // Use DB data or generate dummy stages for the "Oura" feel if missing
  const stages = useMemo(() => {
    if (log.stages) return log.stages

    // Generate dummy stages if not present in DB
    return [
      { stage: 'awake', duration: 15, color: '#ef4444' }, // Red
      { stage: 'light', duration: 180, color: '#60a5fa' }, // Blue
      { stage: 'deep', duration: 90, color: '#1e3a8a' }, // Dark Blue
      { stage: 'rem', duration: 120, color: '#a78bfa' }, // Purple
    ]
  }, [log])

  const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">Sleep Stages</h3>
      
      {/* Simple Stacked Bar (Hypnogram abstraction) */}
      <div className="h-12 w-full rounded-2xl overflow-hidden flex shadow-inner mb-6">
        {stages.map((stage, idx) => (
          <div 
            key={idx}
            className="h-full hover:opacity-80 transition-opacity cursor-pointer"
            style={{ 
              width: `${(stage.duration / totalDuration) * 100}%`,
              backgroundColor: stage.color
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const hours = Math.floor(stage.duration / 60)
          const mins = stage.duration % 60
          const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
          const pct = Math.round((stage.duration / totalDuration) * 100)

          return (
            <div key={stage.stage} className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{stage.stage}</span>
              </div>
              <span className="text-lg font-bold font-mono-numbers text-text-primary">{timeStr}</span>
              <span className="text-xs text-text-muted mt-1">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
