import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseOmniLog } from '../lib/ai'

import useFinance from '../hooks/useFinance'
import useMood from '../hooks/useMood'
import useNutrition from '../hooks/useNutrition'
import useWorkouts from '../hooks/useWorkouts'

export default function GlobalAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastAction, setLastAction] = useState(null)

  const { addTransaction } = useFinance()
  const { logMood } = useMood()
  const { logMeal } = useNutrition()
  const { logWorkout } = useWorkouts()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsProcessing(true)
    setLastAction(null)
    
    try {
      const result = await parseOmniLog(query)
      if (!result) throw new Error("AI returned null")

      let actionsTaken = []

      // 1. Expense
      if (result.expense) {
        await addTransaction({
          type: 'expense',
          amount: result.expense.amount,
          category: result.expense.category || 'other',
          note: result.expense.note || ''
        })
        actionsTaken.push(`Logged $${result.expense.amount} expense`)
      }

      // 2. Mood
      if (result.mood) {
        await logMood({
          mood: result.mood.mood,
          energy: result.mood.energy || 3,
          note: result.mood.note || ''
        })
        actionsTaken.push('Logged mood')
      }

      // 3. Meals
      if (result.meals && result.meals.length > 0) {
        for (const meal of result.meals) {
          await logMeal({
            meal_type: 'snack',
            food_item: meal.food_name,
            calories: meal.calories,
            protein_g: meal.protein_g,
            carbs_g: meal.carbs_g,
            fat_g: meal.fat_g
          })
        }
        actionsTaken.push(`Logged ${result.meals.length} food items`)
      }

      // 4. Workout
      if (result.workout) {
        await logWorkout({
          workout: {
            type: result.workout.type || 'other',
            duration_minutes: result.workout.duration_minutes || 30,
            notes: result.workout.notes || ''
          }
        })
        actionsTaken.push(`Logged ${result.workout.duration_minutes}m workout`)
      }

      if (actionsTaken.length > 0) {
        setLastAction(actionsTaken.join(', '))
        setQuery('')
        toast.success('Omni-log successful!')
        // Auto close after success
        setTimeout(() => {
          setIsOpen(false)
          setLastAction(null)
        }, 2000)
      } else {
        toast.error("AI couldn't figure out what to log.")
      }

    } catch (err) {
      console.error(err)
      toast.error('AI Error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-tr from-accent-purple to-accent-blue rounded-full shadow-[0_0_20px_rgba(124,106,247,0.4)] flex items-center justify-center text-white z-40"
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:bottom-8 w-full md:w-[450px] bg-elevated border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl z-[70] overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface/50">
                <div className="flex items-center gap-2 text-accent-purple font-bold">
                  <Sparkles size={20} />
                  <span>Orbit AI Assistant</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  Tell me what you just did. I can log expenses, moods, meals, and workouts simultaneously.
                </p>

                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. I spent $15 on lunch, I'm feeling exhausted, and I did a 20 min run."
                    className="w-full bg-surface border border-white/10 rounded-2xl p-4 pr-14 text-white text-sm focus:outline-none focus:border-accent-purple resize-none min-h-[120px]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isProcessing}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-accent-purple rounded-xl flex items-center justify-center text-white shadow-lg disabled:opacity-50 transition-all hover:bg-accent-purple/90"
                  >
                    {isProcessing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Sparkles size={18} />
                      </motion.div>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>

                {lastAction && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl flex items-start gap-2"
                  >
                    <CheckCircle2 size={16} className="text-accent-green shrink-0 mt-0.5" />
                    <p className="text-xs text-accent-green font-medium leading-relaxed">
                      {lastAction}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
