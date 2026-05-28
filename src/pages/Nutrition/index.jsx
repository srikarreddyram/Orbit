import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Apple, LayoutDashboard, Utensils, Search } from 'lucide-react'
import useNutrition from '../../hooks/useNutrition'
import useAuth from '../../hooks/useAuth'

import DashboardTab from './tabs/DashboardTab'
import LogTab from './tabs/LogTab'
import SearchTab from './tabs/SearchTab'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'log', label: 'Food Log', icon: Utensils },
  { id: 'search', label: 'Search', icon: Search },
]

export default function Nutrition() {
  const { meals, waterLog, isLoading, logMeal, updateWater } = useNutrition()
  const { profile } = useAuth()
  
  const [activeTab, setActiveTab] = useState('dashboard')

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-amber border-t-transparent animate-spin" />
      </div>
    )
  }

  // Get current date's data
  const todayStr = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter(m => m.logged_at === todayStr)
  
  const todayData = {
    meals: todayMeals,
    water_ml: waterLog ? (waterLog.glasses * 250) : 0,
    total_calories: todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
    total_protein: todayMeals.reduce((sum, m) => sum + Number(m.protein_g || 0), 0),
    total_carbs: todayMeals.reduce((sum, m) => sum + Number(m.carbs_g || 0), 0),
    total_fat: todayMeals.reduce((sum, m) => sum + Number(m.fat_g || 0), 0),
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col">
      {/* Top sticky header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Nutrition
        </h1>
      </div>

      {/* iOS Style Segmented Control (Tabs) */}
      <div className="w-full overflow-x-auto hide-scrollbar mb-6">
        <div className="flex p-1.5 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner w-max min-w-full">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all relative whitespace-nowrap
                  ${isActive ? 'text-white' : 'text-text-muted hover:text-text-secondary'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="nutrition-active-tab"
                    className="absolute inset-0 bg-elevated rounded-xl shadow-lg border border-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardTab data={todayData} profile={profile} />}
            {activeTab === 'log' && <LogTab data={todayData} addMeal={logMeal} updateWater={updateWater} />}
            {activeTab === 'search' && <SearchTab addMeal={logMeal} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
