import { motion } from 'framer-motion'
import { Check, Calendar } from 'lucide-react'

export default function TaskItem({ task, toggleTask, deleteTask }) {
  const isCompleted = task.status === 'completed'
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:bg-white/[0.02] ${
        isCompleted ? 'opacity-50' : 'bg-surface/30 border-white/5 backdrop-blur-md shadow-sm'
      }`}
    >
      {/* Checkbox (Things 3 style) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleTask(task.id, isCompleted ? 'pending' : 'completed')
        }}
        className={`mt-0.5 shrink-0 w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
          isCompleted 
            ? 'bg-accent-blue border-accent-blue text-white' 
            : 'border-text-muted hover:border-accent-blue'
        }`}
      >
        {isCompleted && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-base font-medium transition-colors ${
          isCompleted ? 'text-text-muted line-through' : 'text-text-primary'
        }`}>
          {task.title}
        </h4>
        
        {/* Metadata */}
        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
          {task.project_id && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-md">
              Project {task.project_id}
            </span>
          )}
          {task.due_date && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              new Date(task.due_date) < new Date() && !isCompleted ? 'text-accent-red' : 'text-text-muted'
            }`}>
              <Calendar size={12} />
              {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
