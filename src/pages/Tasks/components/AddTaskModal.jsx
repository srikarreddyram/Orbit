import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Tag, Folder, Send } from 'lucide-react'

export default function AddTaskModal({ isOpen, onClose, addTask, defaultTab }) {
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setTitle('')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const task = {
      title,
      status: 'pending',
      due_date: defaultTab === 'today' ? new Date().toISOString() : null,
      project_id: null
    }

    await addTask(task)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.25 }}
            className="fixed bottom-0 md:bottom-auto md:top-1/3 left-0 right-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full md:w-[600px] bg-elevated/90 backdrop-blur-xl border border-white/10 md:rounded-3xl rounded-t-3xl shadow-2xl p-4 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What would you like to do?"
                className="w-full bg-transparent text-xl md:text-2xl font-medium text-text-primary placeholder:text-text-muted focus:outline-none mb-6 mt-2 px-2"
              />

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 rounded-xl text-text-muted hover:text-accent-blue hover:bg-accent-blue/10 transition-colors">
                    <Calendar size={20} />
                  </button>
                  <button type="button" className="p-2 rounded-xl text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 transition-colors">
                    <Tag size={20} />
                  </button>
                  <button type="button" className="p-2 rounded-xl text-text-muted hover:text-accent-amber hover:bg-accent-amber/10 transition-colors">
                    <Folder size={20} />
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={!title.trim()}
                  className="w-10 h-10 rounded-full bg-accent-blue flex items-center justify-center text-white disabled:opacity-50 disabled:bg-surface disabled:text-text-muted transition-all"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
