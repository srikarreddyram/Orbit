/**
 * Date helper utilities for LifeOS
 */

/**
 * Get time-based greeting
 */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'You should be sleeping 😴'
}

/**
 * Format date to readable string
 */
export function formatDate(date, options = {}) {
  const d = new Date(date)
  const defaults = { month: 'short', day: 'numeric', year: 'numeric' }
  return d.toLocaleDateString('en-US', { ...defaults, ...options })
}

/**
 * Format date relative to today
 */
export function formatRelativeDate(date) {
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)

  const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff === -1) return 'Tomorrow'
  if (diff > 1 && diff < 7) return `${diff} days ago`
  return formatDate(date)
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get date N days ago as YYYY-MM-DD
 */
export function getDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

/**
 * Get start of current week (Monday)
 */
export function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

/**
 * Get start of current month
 */
export function getMonthStart() {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().split('T')[0]
}

/**
 * Format duration in hours to "Xh Ym"
 */
export function formatDuration(hours) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Format time (HH:MM)
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Check if a date is today
 */
export function isToday(date) {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * Check if a date is this week
 */
export function isThisWeek(date) {
  const d = new Date(date)
  const start = new Date(getWeekStart())
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return d >= start && d < end
}

/**
 * Get array of last N days as date strings
 */
export function getLastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    days.push(getDaysAgo(i))
  }
  return days
}
