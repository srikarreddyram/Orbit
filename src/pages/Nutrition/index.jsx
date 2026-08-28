import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Utensils, Plus } from 'lucide-react'
import useNutrition from '../../hooks/useNutrition'
import useAuth from '../../hooks/useAuth'
import useMetrics from '../../hooks/useMetrics'
import { getToday } from '../../utils/dateHelpers'
import { getQualifyingNutritionDays } from '../../utils/nutritionGoals'
import { calculateStreak } from '../../utils/streakCalculator'

import DashboardTab from './tabs/DashboardTab'
import LogTab from './tabs/LogTab'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'log', label: 'Food Log', icon: Utensils },
]

export default function Nutrition() {
  const { meals, waterLog, isLoading, updateWater } = useNutrition()
  const { profile } = useAuth()
  const { metrics } = useMetrics()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard')

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-amber border-t-transparent animate-spin" />
      </div>
    )
  }

  // Get current date's data
  const todayStr = getToday()
  const todayMeals = meals.filter(m => m.logged_at === todayStr)
  const waterGlasses = waterLog?.glasses || 0
  const waterGoalGlasses = profile?.daily_water_goal || 8

  const todayData = {
    meals: todayMeals,
    water_ml: waterGlasses * 250,
    water_glasses: waterGlasses,
    total_calories: todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
    total_protein: todayMeals.reduce((sum, m) => sum + Number(m.protein_g || 0), 0),
    total_carbs: todayMeals.reduce((sum, m) => sum + Number(m.carbs_g || 0), 0),
    total_sugar: todayMeals.reduce((sum, m) => sum + Number(m.sugar_g || 0), 0),
    total_fat: todayMeals.reduce((sum, m) => sum + Number(m.fat_g || 0), 0),
    total_cholesterol: todayMeals.reduce((sum, m) => sum + Number(m.cholesterol_mg || 0), 0),
  }

  const qualifyingDays = getQualifyingNutritionDays(meals, {
    calorieGoal: profile?.daily_calorie_goal || 2000,
    proteinGoal: profile?.daily_protein_goal || 120,
    weightKg: metrics?.weight_kg,
  })
  const { current: streak } = calculateStreak(qualifyingDays)

  const handleLogFood = (mealType) => {
    navigate('/nutrition/log', { state: { mealType } })
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col">
      {/* Top sticky header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Nutrition
        </h1>
        <button
          onClick={() => navigate('/nutrition/log')}
          className="w-10 h-10 bg-accent-amber text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(194,135,42,0.3)] hover:scale-105 active:scale-95 transition-all"
          aria-label="Log food"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Segmented Control (Tabs) — icon-only on mobile so both tabs always
          fit without horizontal scrolling, labels return once there's room. */}
      <div className="w-full mb-6">
        <div className="flex p-1.5 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 md:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all relative whitespace-nowrap
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
                <Icon size={16} className="relative z-10 shrink-0" />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
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
            {activeTab === 'dashboard' && (
              <DashboardTab data={todayData} profile={profile} waterGoalGlasses={waterGoalGlasses} streak={streak} />
            )}
            {activeTab === 'log' && (
              <LogTab
                data={todayData}
                updateWater={updateWater}
                waterGoalGlasses={waterGoalGlasses}
                onLogFood={handleLogFood}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
