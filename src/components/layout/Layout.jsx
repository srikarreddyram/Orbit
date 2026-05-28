import { Outlet } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Header from './Header'
import CommandPalette from './CommandPalette'
import GlobalAIChat from '../GlobalAIChat'
import QuickAddModal from '../QuickAddModal'
import useStore from '../../store/useStore'
import { motion } from 'framer-motion'

import { useState, useEffect } from 'react'

export default function Layout() {
  const { sidebarCollapsed, openQuickAdd } = useStore()
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-base">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isDesktop ? (sidebarCollapsed ? 68 : 240) : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen pb-20 md:pb-0"
      >
        <Header />
        <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </motion.main>

      {/* Bottom nav — mobile only */}
      <BottomNav />

      {/* Command Palette */}
      <CommandPalette />

      {/* Omni-Present AI Assistant */}
      <GlobalAIChat />

      {/* Quick Add Modal */}
      <QuickAddModal />
    </div>
  )
}
