import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, ListChecks } from 'lucide-react'
import TaskItem from '../components/TaskItem'

export default function AllTab({ tasks, onToggle, onEdit, onDelete }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)) : tasks
    return [...list].sort((a, b) => Number(a.completed) - Number(b.completed))
  }, [tasks, query])

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h2 className="text-3xl font-bold text-white mb-1">All Tasks</h2>
        <p className="text-text-muted font-medium">{tasks.length} total</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
            <ListChecks size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">
            {query ? 'No matches' : 'No tasks yet'}
          </h3>
          <p className="text-text-muted text-sm">
            {query ? 'Try a different search.' : 'Everything you add will show up here.'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
