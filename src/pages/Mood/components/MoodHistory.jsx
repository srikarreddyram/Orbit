import { MOOD_CONFIG } from './AddMoodOverlay'
import { formatRelativeDate } from '../../../utils/dateHelpers'

export default function MoodHistory({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="py-32 text-center flex flex-col items-center">
        <h3 className="text-xl font-bold text-text-primary mb-2">How are you feeling?</h3>
        <p className="text-text-muted">Log your mood to start tracking your emotional wellbeing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map(log => {
        const config = MOOD_CONFIG[log.mood] || MOOD_CONFIG[3]
        const Icon = config.icon

        return (
          <div key={log.id} className="bg-surface/30 border border-white/5 rounded-3xl p-5 backdrop-blur-md flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              <Icon size={24} />
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-text-primary text-lg" style={{ color: config.color }}>{config.label}</h3>
                <span className="text-xs font-semibold text-text-muted">{formatRelativeDate(log.logged_at)}</span>
              </div>
              
              {/* Tags/Activities */}
              {log.note && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {log.note.split(',').map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-text-secondary">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
