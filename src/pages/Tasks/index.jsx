import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, Star, Calendar, CheckSquare, Plus, Search } from 'lucide-react'
import useTasks from '../../hooks/useTasks'
import useAuth from '../../hooks/useAuth'

import InboxTab from './tabs/InboxTab'
import TodayTab from './tabs/TodayTab'
import AddTaskModal from './components/AddTaskModal'

const SIDEBAR_ITEMS = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, color: '#3b82f6' },
  { id: 'today', label: 'Today', icon: Star, color: '#f59e0b' },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: '#ec4899' },
  { id: 'anytime', label: 'Anytime', icon: CheckSquare, color: '#10b981' },
]

export default function Tasks() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks()
  const [activeTab, setActiveTab] = useState('today')
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  // Derived state
  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  
  const todayTasks = pendingTasks.filter(t => {
    if (!t.due_date) return false
    const due = new Date(t.due_date)
    const today = new Date()
    return due.toDateString() === today.toDateString()
  })
  
  const inboxTasks = pendingTasks.filter(t => !t.project_id && !t.due_date)

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
            
            let count = 0
            if (item.id === 'today') count = todayTasks.length
            if (item.id === 'inbox') count = inboxTasks.length

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
          <button className="w-10 h-10 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center">
            <Search size={18} className="text-text-muted" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'today' && <TodayTab tasks={tasks} toggleTask={toggleTask} />}
            {activeTab === 'inbox' && <InboxTab tasks={tasks} toggleTask={toggleTask} />}
            {activeTab === 'upcoming' && <div className="text-text-muted py-20 text-center font-semibold">Coming soon...</div>}
            {activeTab === 'anytime' && <div className="text-text-muted py-20 text-center font-semibold">Coming soon...</div>}
          </motion.div>
        </AnimatePresence>

        {/* Floating Action Button (Things 3 style magic button) */}
        <div className="fixed bottom-[120px] md:bottom-12 right-6 md:right-12 z-40">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 bg-accent-blue text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      <AddTaskModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        addTask={addTask}
        defaultTab={activeTab}
      />
    </div>
  )
}
