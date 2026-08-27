import { AnimatePresence } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import TaskItem from '../components/TaskItem'
import { getToday } from '../../../utils/dateHelpers'

function groupLabel(dateStr) {
  const today = new Date(getToday())
  const d = new Date(dateStr)
  const diffDays = Math.round((d - today) / 86400000)

  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 1 && diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'long' })
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function UpcomingTab({ tasks, onToggle, onEdit, onDelete }) {
  const groups = tasks.reduce((acc, task) => {
    const key = task.due_date
    if (!acc[key]) acc[key] = []
    acc[key].push(task)
    return acc
  }, {})
  const sortedDates = Object.keys(groups).sort()

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-white mb-1">Upcoming</h2>
        <p className="text-text-muted font-medium">Scheduled ahead</p>
      </div>

      {sortedDates.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
            <CalendarDays size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Nothing scheduled</h3>
          <p className="text-text-muted text-sm">Tasks with a future due date show up here.</p>
        </div>
      )}

      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">
            {groupLabel(date)}
          </div>
          <AnimatePresence>
            {groups[date].map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
