import TaskItem from '../components/TaskItem'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox } from 'lucide-react'

export default function InboxTab({ tasks, toggleTask }) {
  // Filter for inbox tasks (no date, no project)
  const inboxTasks = tasks.filter(t => !t.project_id && !t.due_date && t.status !== 'completed')

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-white mb-1">Inbox</h2>
        <p className="text-text-muted font-medium flex items-center gap-2">
          Unprocessed tasks
        </p>
      </div>

      {inboxTasks.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
            <Inbox size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Inbox is empty</h3>
          <p className="text-text-muted text-sm">Add a quick thought or task to organize later.</p>
        </div>
      )}

      {inboxTasks.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {inboxTasks.map(task => (
              <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
