import { AnimatePresence } from 'framer-motion'
import { Inbox } from 'lucide-react'
import TaskItem from '../components/TaskItem'

export default function InboxTab({ tasks, onToggle, onEdit, onDelete }) {
  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-white mb-1">Inbox</h2>
        <p className="text-text-muted font-medium">Unscheduled tasks</p>
      </div>

      {tasks.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
            <Inbox size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Inbox is empty</h3>
          <p className="text-text-muted text-sm">Add a quick thought or task to organize later.</p>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
