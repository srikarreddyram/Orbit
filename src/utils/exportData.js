import { supabase } from '../lib/supabase'

/**
 * Export all user data as JSON
 */
export async function exportAllData() {
  const tables = [
    'profiles',
    'tasks',
    'workouts',
    'workout_sets',
    'sleep_logs',
    'meals',
    'water_logs',
    'transactions',
    'budget_limits',
    'habits',
    'habit_completions',
    'mood_logs',
    'personal_records',
  ]

  const data = {}

  for (const table of tables) {
    const { data: rows, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error fetching ${table}:`, error)
      data[table] = { error: error.message }
    } else {
      data[table] = rows
    }
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lifeos-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return data
}
