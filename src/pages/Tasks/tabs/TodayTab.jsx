import { AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import TaskItem from '../components/TaskItem'

export default function TodayTab({ overdueTasks, todayTasks, loggedTasks, onToggle, onEdit, onDelete }) {
  const isEmpty = overdueTasks.length === 0 && todayTasks.length === 0 && loggedTasks.length === 0

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-white mb-1">Today</h2>
        <p className="text-text-muted font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {isEmpty && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">No tasks for today</h3>
          <p className="text-text-muted text-sm">Enjoy your day or add some new tasks.</p>
        </div>
      )}

      {overdueTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-accent-red uppercase tracking-wider mb-2 ml-1">
            <AlertCircle size={12} />
            Overdue
          </div>
          <AnimatePresence>
            {overdueTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {todayTasks.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {loggedTasks.length > 0 && (
        <div className="space-y-2 pt-6 border-t border-white/5">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">
            Logged
          </div>
          <AnimatePresence>
            {loggedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
