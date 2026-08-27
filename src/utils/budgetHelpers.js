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

/**
 * Normalize a budget's limit to a monthly-equivalent amount, so budgets on
 * different spans can still be summed meaningfully (e.g. for LifeScore).
 */
export function toMonthlyEquivalent(amount, period) {
  switch (period) {
    case 'weekly': return amount * (52 / 12)
    case 'quarterly': return amount / 3
    case 'yearly': return amount / 12
    case 'monthly':
    default: return amount
  }
}
