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
 * Parse a value as a local calendar date. A bare "YYYY-MM-DD" string is
 * constructed from its parts (local midnight) instead of going through
 * `new Date(string)`, which parses date-only strings as UTC and can shift
 * the calendar day backward for anyone west of UTC. Anything else (a full
 * timestamp, a Date) is parsed normally.
 */
function toLocalDate(date) {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(date)
}

/**
 * Format a Date as a local "YYYY-MM-DD" string. Deliberately avoids
 * `toISOString()`, which converts to UTC first and can land on the wrong
 * calendar day for any timezone that isn't UTC.
 */
function toLocalDateString(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Format date to readable string
 */
export function formatDate(date, options = {}) {
  const d = toLocalDate(date)
  const defaults = { month: 'short', day: 'numeric', year: 'numeric' }
  return d.toLocaleDateString('en-US', { ...defaults, ...options })
}

/**
 * Format date relative to today
 */
export function formatRelativeDate(date) {
  const d = toLocalDate(date)
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
  return toLocalDateString(new Date())
}

/**
 * Get date N days ago as YYYY-MM-DD
 */
export function getDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toLocalDateString(d)
}

/**
 * Get start of current week (Monday)
 */
export function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return toLocalDateString(d)
}

/**
 * Get start of current month
 */
export function getMonthStart() {
  const d = new Date()
  d.setDate(1)
  return toLocalDateString(d)
}

/**
 * Get start of current quarter
 */
export function getQuarterStart() {
  const d = new Date()
  const quarterMonth = Math.floor(d.getMonth() / 3) * 3
  return toLocalDateString(new Date(d.getFullYear(), quarterMonth, 1))
}

/**
 * Get start of current year
 */
export function getYearStart() {
  const d = new Date()
  return toLocalDateString(new Date(d.getFullYear(), 0, 1))
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
  const d = toLocalDate(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * Check if a date is this week
 */
export function isThisWeek(date) {
  const d = toLocalDate(date)
  const start = toLocalDate(getWeekStart())
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return d >= start && d < end
}

/**
 * Check if a date falls within the current calendar month
 */
export function isThisMonth(date) {
  const d = toLocalDate(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
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
