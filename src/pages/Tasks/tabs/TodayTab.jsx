import TaskItem from '../components/TaskItem'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function TodayTab({ tasks, toggleTask }) {
  // Filter for today's tasks
  const todayTasks = tasks.filter(t => {
    if (!t.due_date) return false
    const due = new Date(t.due_date)
    const today = new Date()
    return due.toDateString() === today.toDateString()
  })

  const pending = todayTasks.filter(t => t.status !== 'completed')
  const completed = todayTasks.filter(t => t.status === 'completed')

  return (
    <div className="space-y-8">
      {/* Date Header (Things 3 style) */}
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-white mb-1">Today</h2>
        <p className="text-text-muted font-medium flex items-center gap-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {pending.length === 0 && completed.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">No tasks for today</h3>
          <p className="text-text-muted text-sm">Enjoy your day or add some new tasks.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {pending.map(task => (
              <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2 pt-6 border-t border-white/5">
          <button className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-4">
            Logged
          </button>
          <AnimatePresence>
            {completed.map(task => (
              <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
