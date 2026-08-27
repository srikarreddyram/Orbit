import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Dumbbell,
  Moon,
  UtensilsCrossed,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  Settings,
} from 'lucide-react'

const mainTabs = [
  { path: '/', icon: LayoutDashboard, label: 'Today' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { path: '/sleep', icon: Moon, label: 'Sleep' },
  { path: '/nutrition', icon: UtensilsCrossed, label: 'Food' },
]

const moreTabs = [
  { path: '/finance', icon: Wallet, label: 'Finance' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed bottom-20 left-4 right-4 z-50 glass rounded-2xl p-3 grid grid-cols-2 gap-2"
            >
              {moreTabs.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 py-3 rounded-xl text-xs transition-colors
                    ${isActive ? 'text-cursed-purple bg-cursed-purple/10' : 'text-text-secondary'}`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {mainTabs.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs transition-colors
                ${isActive ? 'text-cursed-purple' : 'text-text-muted'}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs transition-colors
              ${moreOpen ? 'text-cursed-purple' : 'text-text-muted'}`}
            aria-label="More modules"
          >
            <Menu size={20} />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
