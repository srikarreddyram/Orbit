import { useMemo } from 'react'
import { MOOD_CONFIG } from './AddMoodOverlay'
import { motion } from 'framer-motion'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function YearInPixels({ logs }) {
  const yearData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    
    // Create a map of YYYY-MM-DD -> mood score
    const moodMap = {}
    logs.forEach(log => {
      // Assuming log.logged_at is YYYY-MM-DD
      const dateStr = log.logged_at.split('T')[0]
      // If multiple logs on same day, take the latest one (since logs might be ordered by time)
      moodMap[dateStr] = log.mood
    })

    const months = []
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(currentYear, m + 1, 0).getDate()
      const days = []
      
      for (let d = 1; d <= 31; d++) {
        if (d > daysInMonth) {
          days.push(null) // Invalid day
          continue
        }

        const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        days.push({
          date: dateStr,
          mood: moodMap[dateStr] || null
        })
      }
      months.push({ name: MONTHS[m], days })
    }

    return months
  }, [logs])

  return (
    <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md mt-8 overflow-x-auto hide-scrollbar">
      <h3 className="text-xl font-bold text-text-primary mb-6">Year in Pixels</h3>
      
      <div className="min-w-[700px]">
        {/* Header row (Days 1-31) */}
        <div className="flex mb-2">
          <div className="w-12 shrink-0"></div>
          <div className="flex-1 flex justify-between">
            {[...Array(31)].map((_, i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-text-muted font-mono-numbers">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1.5">
          {yearData.map((month, i) => (
            <div key={i} className="flex items-center">
              <div className="w-12 shrink-0 text-xs font-semibold text-text-secondary">
                {month.name}
              </div>
              <div className="flex-1 flex justify-between gap-1">
                {month.days.map((day, j) => {
                  if (day === null) {
                    return <div key={j} className="flex-1 aspect-square rounded-sm bg-transparent" />
                  }

                  const config = day.mood ? MOOD_CONFIG[day.mood] : null
                  const bg = config ? config.color : 'rgba(255, 255, 255, 0.03)'
                  
                  return (
                    <motion.div 
                      key={j}
                      title={day.mood ? `${day.date}: ${config.label}` : day.date}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="flex-1 aspect-square rounded-sm relative group cursor-pointer transition-colors"
                      style={{ backgroundColor: bg }}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {[1, 2, 3, 4, 5].map(score => (
            <div key={score} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: MOOD_CONFIG[score].color }} />
              <span className="text-xs text-text-muted">{MOOD_CONFIG[score].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
