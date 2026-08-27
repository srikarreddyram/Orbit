import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, Star, Calendar, ListChecks, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import useTasks from '../../hooks/useTasks'
import { getToday } from '../../utils/dateHelpers'

import InboxTab from './tabs/InboxTab'
import TodayTab from './tabs/TodayTab'
import UpcomingTab from './tabs/UpcomingTab'
import AllTab from './tabs/AllTab'
import AddTaskModal from './components/AddTaskModal'

const SIDEBAR_ITEMS = [
  { id: 'today', label: 'Today', icon: Star, color: '#C2872A' },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: '#9D5C7C' },
  { id: 'inbox', label: 'Inbox', icon: Inbox, color: '#38BDF8' },
  { id: 'all', label: 'All', icon: ListChecks, color: '#8B5CF6' },
]

export default function Tasks() {
  const { tasks, isLoading, addTask, updateTask, toggleTask, deleteTask } = useTasks()
  const [activeTab, setActiveTab] = useState('today')
  const [editingTask, setEditingTask] = useState(undefined) // undefined = closed, null = new, object = editing
  const [hiddenIds, setHiddenIds] = useState(() => new Set())
  const deleteTimers = useRef({})

  const today = getToday()

  const buckets = useMemo(() => {
    const visible = tasks.filter((t) => !hiddenIds.has(t.id))
    const open = visible.filter((t) => !t.completed)
    return {
      overdueTasks: open.filter((t) => t.due_date && t.due_date < today),
      todayTasks: open.filter((t) => t.due_date === today),
      loggedTasks: visible.filter((t) => t.completed && t.completed_at?.startsWith(today)),
      inboxTasks: open.filter((t) => !t.due_date),
      upcomingTasks: open.filter((t) => t.due_date && t.due_date > today),
      allTasks: visible,
    }
  }, [tasks, hiddenIds, today])

  const counts = {
    today: buckets.overdueTasks.length + buckets.todayTasks.length,
    upcoming: buckets.upcomingTasks.length,
    inbox: buckets.inboxTasks.length,
    all: 0,
  }

  const handleToggle = (task) => {
    toggleTask({ id: task.id, completed: !task.completed })
  }

  const handleRequestDelete = (task) => {
    setHiddenIds((prev) => new Set(prev).add(task.id))

    toast((t) => (
      <div className="flex items-center gap-3">
        <span className="text-sm">Task deleted</span>
        <button
          onClick={() => {
            clearTimeout(deleteTimers.current[task.id])
            delete deleteTimers.current[task.id]
            setHiddenIds((prev) => {
              const next = new Set(prev)
              next.delete(task.id)
              return next
            })
            toast.dismiss(t.id)
          }}
          className="text-accent-blue font-semibold text-sm"
        >
          Undo
        </button>
      </div>
    ), { duration: 4000 })

    deleteTimers.current[task.id] = setTimeout(() => {
      deleteTask(task.id).catch(() => {
        setHiddenIds((prev) => {
          const next = new Set(prev)
          next.delete(task.id)
          return next
        })
        toast.error('Failed to delete task')
      })
      delete deleteTimers.current[task.id]
    }, 4000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  const sharedProps = { onToggle: handleToggle, onEdit: setEditingTask, onDelete: handleRequestDelete }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col md:flex-row gap-8">
      {/* Sidebar (Desktop) / Top Row (Mobile) */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6 hidden md:block">
          Tasks
        </h1>

        <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const count = counts[item.id]

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal shrink-0 group ${
                  isActive
                    ? 'bg-accent-blue/10 border border-accent-blue/20'
                    : 'hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} style={{ color: item.color }} className={isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 transition-opacity'} />
                  <span className={`font-semibold ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary transition-colors'}`}>
                    {item.label}
                  </span>
                </div>
                {count > 0 && (
                  <span className={`text-xs font-bold font-mono-numbers px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-accent-blue/20 text-accent-blue' : 'bg-surface text-text-muted'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl pb-24 md:pb-12">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white capitalize">
            {activeTab}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'today' && (
              <TodayTab
                overdueTasks={buckets.overdueTasks}
                todayTasks={buckets.todayTasks}
                loggedTasks={buckets.loggedTasks}
                {...sharedProps}
              />
            )}
            {activeTab === 'upcoming' && <UpcomingTab tasks={buckets.upcomingTasks} {...sharedProps} />}
            {activeTab === 'inbox' && <InboxTab tasks={buckets.inboxTasks} {...sharedProps} />}
            {activeTab === 'all' && <AllTab tasks={buckets.allTasks} {...sharedProps} />}
          </motion.div>
        </AnimatePresence>

        {/* Floating Action Button */}
        <div className="fixed bottom-[120px] md:bottom-12 right-6 md:right-12 z-40">
          <button
            onClick={() => setEditingTask(null)}
            className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
            aria-label="Add task"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      <AddTaskModal
        isOpen={editingTask !== undefined}
        onClose={() => setEditingTask(undefined)}
        addTask={addTask}
        updateTask={updateTask}
        task={editingTask}
        defaultDueToday={activeTab === 'today'}
      />
    </div>
  )
}
