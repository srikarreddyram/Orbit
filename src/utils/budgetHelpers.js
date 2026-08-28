import { getWeekStart, getMonthStart, getQuarterStart, getYearStart } from './dateHelpers'

export const BUDGET_PERIODS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'yearly', label: 'Yearly' },
]

/**
 * Start date (YYYY-MM-DD) of the current window for a budget's period —
 * spending is scoped to this window when checking a budget's limit.
 */
export function getPeriodStart(period) {
  switch (period) {
    case 'weekly': return getWeekStart()
    case 'quarterly': return getQuarterStart()
    case 'yearly': return getYearStart()
    case 'monthly':
    default: return getMonthStart()
  }
}
