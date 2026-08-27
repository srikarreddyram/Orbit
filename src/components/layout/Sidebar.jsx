import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Dumbbell,
  Moon,
  UtensilsCrossed,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import useStore from '../../store/useStore'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Today' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { path: '/sleep', icon: Moon, label: 'Sleep' },
  { path: '/nutrition', icon: UtensilsCrossed, label: 'Nutrition' },
  { path: '/finance', icon: Wallet, label: 'Finance' },
]

const bottomItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 68 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-surface border-r border-border"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow-purple"
          style={{ background: '#7C3AED' }}
        >
          <Sparkles size={18} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-lg text-text-primary tracking-tight"
          >
            Orbit
          </motion.span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-cursed-purple/10 text-cursed-purple'
                : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-cursed-purple"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <item.icon size={20} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="py-4 px-3 border-t border-border space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-cursed-purple/10 text-cursed-purple'
                : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-elevated transition-all duration-150 w-full"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} className="flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft size={20} className="flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
