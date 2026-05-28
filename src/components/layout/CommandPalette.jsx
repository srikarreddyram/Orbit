import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, CheckSquare, Dumbbell, Moon, UtensilsCrossed, Wallet, Target, Smile, Settings, Plus } from 'lucide-react'
import useStore from '../../store/useStore'

const pages = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Workouts', path: '/workouts', icon: Dumbbell },
  { name: 'Sleep', path: '/sleep', icon: Moon },
  { name: 'Nutrition', path: '/nutrition', icon: UtensilsCrossed },
  { name: 'Finance', path: '/finance', icon: Wallet },
  { name: 'Habits', path: '/habits', icon: Target },
  { name: 'Mood', path: '/mood', icon: Smile },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Filter items
  const filteredItems = [
    ...pages.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    // Could add more commands here like "Add Task", "Log Workout"
    ...(query.toLowerCase().includes('add') || query.toLowerCase().includes('new')
      ? [{ name: 'New Task', action: 'add_task', icon: Plus }]
      : [])
  ]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (item) => {
    if (item.path) {
      navigate(item.path)
    } else if (item.action === 'add_task') {
      navigate('/tasks')
      // You could trigger a global event or store state to open the add form
    }
    setCommandPaletteOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else if (e.key === 'Enter' && filteredItems.length > 0) {
      e.preventDefault()
      handleSelect(filteredItems[selectedIndex])
    }
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-base border border-border shadow-2xl rounded-2xl overflow-hidden relative z-10 mx-4"
          >
            {/* Input area */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface/50">
              <Search size={18} className="text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Where do you want to go? (Navigation)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none text-text-primary text-base placeholder:text-text-muted focus:outline-none focus:ring-0"
              />
              <span className="text-xs text-text-muted font-mono-numbers px-1.5 py-0.5 rounded bg-elevated border border-border">
                ESC
              </span>
            </div>

            {/* Results list */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-text-muted">
                  No results found.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon
                  const isSelected = index === selectedIndex
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors
                        ${isSelected ? 'bg-accent-purple/15 text-text-primary' : 'text-text-secondary hover:bg-surface'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isSelected ? 'text-accent-purple' : 'text-text-muted'} />
                        <span>{item.name}</span>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-text-muted font-mono-numbers opacity-50">
                          ↵
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
