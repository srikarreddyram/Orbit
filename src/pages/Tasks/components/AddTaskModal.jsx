import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Flag, Tag, Send, X } from 'lucide-react'
import { getToday } from '../../../utils/dateHelpers'

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-accent-blue' },
  { value: 'medium', label: 'Medium', color: 'text-accent-amber' },
  { value: 'high', label: 'High', color: 'text-accent-red' },
]

const CATEGORIES = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
]

function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function AddTaskModal({ isOpen, onClose, addTask, updateTask, task, defaultDueToday }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <TaskFormSheet
          key={task?.id ?? 'new'}
          onClose={onClose}
          addTask={addTask}
          updateTask={updateTask}
          task={task}
          defaultDueToday={defaultDueToday}
        />
      )}
    </AnimatePresence>
  )
}

function TaskFormSheet({ onClose, addTask, updateTask, task, defaultDueToday }) {
  const isEditing = !!task
  const [title, setTitle] = useState(task?.title || '')
  const [dueDate, setDueDate] = useState(task?.due_date || (defaultDueToday ? getToday() : null))
  const [dueTime, setDueTime] = useState(task?.due_time || null)
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [category, setCategory] = useState(task?.category || 'personal')
  const [panel, setPanel] = useState(null) // 'date' | 'priority' | 'category' | null
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || saving) return
    setSaving(true)
    try {
      const payload = { title: title.trim(), due_date: dueDate, due_time: dueDate ? dueTime : null, priority, category }
      if (isEditing) {
        await updateTask({ id: task.id, updates: payload })
      } else {
        await addTask({ ...payload, completed: false })
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        className="fixed bottom-0 md:bottom-auto md:top-1/3 left-0 right-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full md:w-[560px] glass shadow-elevated md:rounded-3xl rounded-t-3xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to do?"
              className="flex-1 bg-transparent text-xl md:text-2xl font-medium text-text-primary placeholder:text-text-muted focus:outline-none mb-4 mt-1 px-1"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors md:hidden"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {panel === 'date' && (
              <motion.div
                key="date"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-3">
                  {[
                    { label: 'No date', value: null },
                    { label: 'Today', value: getToday() },
                    { label: 'Tomorrow', value: tomorrow() },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setDueDate(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        dueDate === opt.value
                          ? 'bg-accent-blue text-white'
                          : 'bg-surface text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <input
                    type="date"
                    value={dueDate || ''}
                    onChange={(e) => setDueDate(e.target.value || null)}
                    className="input-field flex-1 min-w-[140px] py-1.5 text-sm"
                  />
                  {dueDate && (
                    <input
                      type="time"
                      value={dueTime || ''}
                      onChange={(e) => setDueTime(e.target.value || null)}
                      className="input-field flex-1 min-w-[110px] py-1.5 text-sm"
                      aria-label="Deadline time"
                    />
                  )}
                </div>
              </motion.div>
            )}

            {panel === 'priority' && (
              <motion.div
                key="priority"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-3">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        priority === p.value
                          ? 'bg-accent-blue text-white'
                          : 'bg-surface text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Flag size={12} className={priority === p.value ? 'text-white' : p.color} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {panel === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        category === c.value
                          ? 'bg-accent-blue text-white'
                          : 'bg-surface text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPanel(panel === 'date' ? null : 'date')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  panel === 'date' || dueDate ? 'text-accent-blue bg-accent-blue/10' : 'text-text-muted hover:bg-surface'
                }`}
              >
                <Calendar size={16} />
                {dueDate && (
                  <span className="hidden sm:inline">
                    {dueDate === getToday() ? 'Today' : dueDate}{dueTime ? ` · ${dueTime}` : ''}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPanel(panel === 'priority' ? null : 'priority')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  panel === 'priority' || priority !== 'medium' ? 'text-accent-amber bg-accent-amber/10' : 'text-text-muted hover:bg-surface'
                }`}
              >
                <Flag size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPanel(panel === 'category' ? null : 'category')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  panel === 'category' || category !== 'personal' ? 'text-accent-purple bg-accent-purple/10' : 'text-text-muted hover:bg-surface'
                }`}
              >
                <Tag size={16} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="w-10 h-10 rounded-full bg-accent-blue flex items-center justify-center text-white disabled:opacity-50 disabled:bg-surface disabled:text-text-muted transition-all active:scale-95"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
