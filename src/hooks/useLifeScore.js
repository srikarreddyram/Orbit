import { useMemo } from 'react'
import useTasks from './useTasks'
import useWorkouts from './useWorkouts'
import useSleep from './useSleep'
import useNutrition from './useNutrition'
import useHabits from './useHabits'
import useAuth from './useAuth'
import {
  calculateTaskScore,
  calculateWorkoutScore,
  calculateSleepScore,
  calculateCalorieScore,
  calculateHabitScore,
  calculateLifeScore,
} from '../utils/scoreCalculator'
import { getToday, isThisWeek } from '../utils/dateHelpers'

export default function useLifeScore() {
  const { profile } = useAuth()
  
  // Bring in data from all modules
  const { tasks } = useTasks()
  const { workouts } = useWorkouts()
  const { sleepLogs } = useSleep()
  const { meals } = useNutrition()
  const { habits, completions } = useHabits()

  const scores = useMemo(() => {
    const today = getToday()

    // 1. Tasks
    const todayTasks = tasks.filter(t => t.due_date === today)
    const taskScore = calculateTaskScore(todayTasks)

    // 2. Workouts
    const weeklyWorkouts = workouts.filter(w => isThisWeek(w.logged_at)).length
    const workoutScore = calculateWorkoutScore(weeklyWorkouts, profile?.weekly_workout_goal || 4)

    // 3. Sleep
    // Find last night's sleep (logged today or yesterday)
    const lastSleep = sleepLogs[sleepLogs.length - 1]
    const sleepScore = calculateSleepScore(lastSleep?.duration_hours || 0, profile?.sleep_target_hours || 8)

    // 4. Calories
    const todayMeals = meals.filter(m => m.logged_at === today)
    const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0)
    const calorieScore = calculateCalorieScore(caloriesConsumed, profile?.daily_calorie_goal || 2000)

    // 5. Habits
    // Check how many of today's habits are completed
    const activeHabits = habits.length
    const completedToday = completions.filter(c => c.completed_on === today).length
    const habitScore = calculateHabitScore(activeHabits, completedToday)

    // 6. Overall
    const overall = calculateLifeScore({
      tasks: taskScore,
      workouts: workoutScore,
      sleep: sleepScore,
      calories: calorieScore,
      habits: habitScore,
    }, profile?.lifescore_weights)

    return {
      overall,
      components: {
        tasks: taskScore,
        workouts: workoutScore,
        sleep: sleepScore,
        calories: calorieScore,
        habits: habitScore,
      }
    }
  }, [tasks, workouts, sleepLogs, meals, habits, completions, profile])

  return scores
}
