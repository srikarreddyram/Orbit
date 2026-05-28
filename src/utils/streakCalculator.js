import { getToday } from './dateHelpers'

/**
 * Calculates current and max streak from an array of date strings
 * @param {string[]} dates - Array of ISO date strings (or YYYY-MM-DD)
 * @returns {{ current: number, max: number }}
 */
export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return { current: 0, max: 0 }

  // Extract just the YYYY-MM-DD part and get unique days
  const uniqueDays = [...new Set(dates.map(d => {
    try {
      return new Date(d).toISOString().split('T')[0]
    } catch (e) {
      return d.split('T')[0]
    }
  }))].sort()

  if (uniqueDays.length === 0) return { current: 0, max: 0 }

  const todayStr = getToday()
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

  let currentStreak = 0
  let maxStreak = 0
  let tempStreak = 1

  // Calculate max streak
  for (let i = 1; i < uniqueDays.length; i++) {
    const prevDate = new Date(uniqueDays[i - 1])
    const currDate = new Date(uniqueDays[i])
    
    // Difference in days
    const diffTime = Math.abs(currDate - prevDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      tempStreak++
    } else {
      maxStreak = Math.max(maxStreak, tempStreak)
      tempStreak = 1
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak)

  // Calculate current streak (working backwards from today or yesterday)
  const lastLoggedDay = uniqueDays[uniqueDays.length - 1]
  
  if (lastLoggedDay === todayStr || lastLoggedDay === yesterdayStr) {
    currentStreak = 1
    for (let i = uniqueDays.length - 1; i > 0; i--) {
      const currDate = new Date(uniqueDays[i])
      const prevDate = new Date(uniqueDays[i - 1])
      
      const diffTime = Math.abs(currDate - prevDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
      } else {
        break
      }
    }
  } else {
    currentStreak = 0
  }

  return { current: currentStreak, max: maxStreak }
}
