/**
 * LifeScore Calculator
 *
 * Computes a 0–100 score based on 5 weighted components:
 * Tasks (20%), Workouts (20%), Sleep (20%), Calories (20%), Finance (20%)
 */

/**
 * Calculate task score (0-100)
 * ≥1 task completed today = full points, scaled by completion rate
 */
export function calculateTaskScore(todayTasks) {
  if (!todayTasks || todayTasks.length === 0) return 0
  const completed = todayTasks.filter(t => t.completed).length
  const total = todayTasks.length
  return Math.round((completed / total) * 100)
}

/**
 * Calculate workout score (0-100)
 * Weekly goal hit = full points, prorated by workouts/goal
 */
export function calculateWorkoutScore(weeklyWorkouts, weeklyGoal) {
  if (!weeklyGoal || weeklyGoal === 0) return 100
  const count = weeklyWorkouts || 0
  return Math.min(100, Math.round((count / weeklyGoal) * 100))
}

/**
 * Calculate sleep score (0-100)
 * Hours last night vs. target (capped at 100% if ≥ target)
 */
export function calculateSleepScore(lastNightHours, targetHours) {
  if (!lastNightHours || !targetHours) return 0
  if (lastNightHours >= targetHours) return 100
  return Math.round((lastNightHours / targetHours) * 100)
}

/**
 * Calculate calorie score (0-100)
 * Within ±10% of daily goal = full points, degrades outside
 */
export function calculateCalorieScore(caloriesConsumed, calorieGoal) {
  if (!calorieGoal || calorieGoal === 0) return 100
  if (!caloriesConsumed) return 0
  
  const ratio = caloriesConsumed / calorieGoal
  const deviation = Math.abs(1 - ratio)
  
  if (deviation <= 0.1) return 100 // Within ±10%
  if (deviation <= 0.2) return 80
  if (deviation <= 0.3) return 60
  if (deviation <= 0.4) return 40
  if (deviation <= 0.5) return 20
  return 0
}

/**
 * Calculate finance score (0-100)
 * Staying at or under the monthly budget = full points, degrades the further over it goes
 */
export function calculateFinanceScore(spentThisMonth, monthlyBudget) {
  if (!monthlyBudget || monthlyBudget === 0) return 100
  if (spentThisMonth <= monthlyBudget) return 100

  const overRatio = (spentThisMonth - monthlyBudget) / monthlyBudget
  if (overRatio <= 0.1) return 80
  if (overRatio <= 0.25) return 60
  if (overRatio <= 0.5) return 40
  if (overRatio <= 1) return 20
  return 0
}

/**
 * Calculate overall LifeScore (0-100)
 */
export function calculateLifeScore(components, weights = null) {
  const defaultWeights = {
    tasks: 20,
    workouts: 20,
    sleep: 20,
    calories: 20,
    finance: 20,
  }

  // Guard against stale stored weight objects (e.g. an old `habits` key from
  // before Finance replaced Habits as the 5th component) — only the known
  // component keys count toward the total, anything else is ignored.
  const w = { ...defaultWeights, ...weights }
  const totalWeight = w.tasks + w.workouts + w.sleep + w.calories + w.finance

  const score =
    (components.tasks * w.tasks +
      components.workouts * w.workouts +
      components.sleep * w.sleep +
      components.calories * w.calories +
      components.finance * w.finance) / totalWeight

  return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * Get score color based on value
 */
export function getScoreColor(score) {
  if (score >= 70) return '#38BDF8' // Cursed blue — domain expansion
  if (score >= 40) return '#7C3AED' // Cursed purple — steady
  return '#B91C1C' // Blood red — danger
}

/**
 * Get score label
 */
export function getScoreLabel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Great'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Fair'
  return 'Needs work'
}
