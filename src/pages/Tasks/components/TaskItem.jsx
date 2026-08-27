import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import { PriorityBadge, CategoryBadge } from '../../../components/ui/Badge'
import { getToday } from '../../../utils/dateHelpers'

const ACTION_WIDTH = 76

function formatDueDate(dateStr) {
  const today = getToday()
  if (dateStr === today) return 'Today'
  const d = new Date(dateStr)
  const t = new Date(today)
  const diffDays = Math.round((d - t) / 86400000)
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const draggedRef = useRef(false)
  const isCompleted = task.completed
  const isOverdue = !isCompleted && task.due_date && task.due_date < getToday()

  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Sliding track: row + delete action side by side, wider than the visible frame
          so the action sits fully off-screen at rest instead of stacked behind the row. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, x: open ? -ACTION_WIDTH : 0 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -ACTION_WIDTH, right: 0 }}
        dragElastic={0.06}
        onDragStart={() => { draggedRef.current = true }}
        onDragEnd={(_, info) => {
          setOpen(info.offset.x < -36)
          setTimeout(() => { draggedRef.current = false }, 0)
        }}
        className="flex items-stretch"
        style={{ width: `calc(100% + ${ACTION_WIDTH}px)` }}
      >
        <div
          onClick={() => {
            if (draggedRef.current) return
            open ? setOpen(false) : onEdit(task)
          }}
          className={`flex-1 min-w-0 flex items-start gap-3 p-4 cursor-pointer border transition-colors ${
            isCompleted
              ? 'bg-base border-transparent'
              : 'bg-[#17151A] border-white/5 hover:border-white/10'
          }`}
        >
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(task)
            }}
            className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              isCompleted
                ? 'bg-accent-blue border-accent-blue text-white'
                : 'border-text-muted hover:border-accent-blue'
            }`}
            aria-label={isCompleted ? 'Mark as not done' : 'Mark as done'}
          >
            {isCompleted && <Check size={13} strokeWidth={3} />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4
              className={`text-base font-medium leading-snug ${
                isCompleted ? 'text-text-muted line-through' : 'text-text-primary'
              }`}
            >
              {task.title}
            </h4>

            {(task.due_date || task.priority !== 'medium' || task.category !== 'personal') && (
              <div className={`flex items-center gap-2 mt-1.5 flex-wrap ${isCompleted ? 'opacity-60' : ''}`}>
                {task.due_date && (
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isOverdue ? 'text-accent-red' : 'text-text-muted'
                    }`}
                  >
                    {isOverdue ? 'Overdue' : formatDueDate(task.due_date)}
                  </span>
                )}
                {task.priority !== 'medium' && <PriorityBadge priority={task.priority} />}
                {task.category !== 'personal' && <CategoryBadge category={task.category} />}
              </div>
            )}
          </div>
        </div>

        {/* Delete action */}
        <button
          onClick={() => {
            setOpen(false)
            onDelete(task)
          }}
          style={{ width: ACTION_WIDTH }}
          className="shrink-0 flex items-center justify-center bg-accent-red text-white"
          aria-label={`Delete "${task.title}"`}
        >
          <Trash2 size={18} />
        </button>
      </motion.div>
    </div>
  )
}
