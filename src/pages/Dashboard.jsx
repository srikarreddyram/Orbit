import { motion } from 'framer-motion'
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import {
  CheckSquare,
  Dumbbell,
  UtensilsCrossed,
  Wallet,
  Flame,
  Droplets,
} from 'lucide-react'
import Card, { StatCard } from '../components/ui/Card'
import useAuth from '../hooks/useAuth'
import useTasks from '../hooks/useTasks'
import useWorkouts from '../hooks/useWorkouts'
import useNutrition from '../hooks/useNutrition'
import useFinance from '../hooks/useFinance'
import { getToday, isThisWeek, isThisMonth, getLastNDays, formatDate } from '../utils/dateHelpers'
import { calculateStreak } from '../utils/streakCalculator'
import { formatCurrency } from '../utils/currencyHelpers'

const MEAL_WINDOWS = [
  { type: 'breakfast', label: 'Breakfast', startHour: 5 },
  { type: 'lunch', label: 'Lunch', startHour: 11 },
  { type: 'dinner', label: 'Dinner', startHour: 16 },
]

function formatTime12h(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/**
 * "Coming Up Today" — what's still ahead across tasks, meals, and workouts,
 * in place of a single rolled-up score.
 */
function RemindersPanel({ upcomingTasks, missedMeals, workoutsToday, workoutsRemaining }) {
  const hasWorkoutNudge = !workoutsToday && workoutsRemaining > 0
  const hasAnything = upcomingTasks.length > 0 || missedMeals.length > 0 || hasWorkoutNudge

  return (
    <Card className="w-full max-w-2xl mx-auto grain">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Coming Up Today</h2>
      {!hasAnything ? (
        <p className="text-sm text-text-muted text-center py-8">You're all caught up. Nothing pending today.</p>
      ) : (
        <div className="space-y-3">
          {upcomingTasks.slice(0, 4).map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cursed-purple/10 flex items-center justify-center shrink-0">
                <CheckSquare size={14} className="text-cursed-purple" />
              </div>
              <p className="flex-1 min-w-0 text-sm text-text-primary truncate">{task.title}</p>
              {task.due_time && (
                <span className="text-xs font-mono-numbers text-text-muted shrink-0">{formatTime12h(task.due_time)}</span>
              )}
            </div>
          ))}
          {missedMeals.map((w) => (
            <div key={w.type} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center shrink-0">
                <UtensilsCrossed size={14} className="text-accent-amber" />
              </div>
              <p className="flex-1 text-sm text-text-primary">Haven't logged {w.label.toLowerCase()} yet</p>
            </div>
          ))}
          {hasWorkoutNudge && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blood/10 flex items-center justify-center shrink-0">
                <Dumbbell size={14} className="text-blood" />
              </div>
              <p className="flex-1 text-sm text-text-primary">
                {workoutsRemaining} workout{workoutsRemaining === 1 ? '' : 's'} left this week — fit one in today?
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

/**
 * Module Summary Widget
 */
function ModuleWidget({ icon: Icon, title, subtitle, value, color = 'text-accent-purple', children }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10`}
            style={{ backgroundColor: `${color === 'text-accent-purple' ? '#7C3AED' : color === 'text-accent-green' ? '#38BDF8' : color === 'text-accent-blue' ? '#38BDF8' : color === 'text-accent-amber' ? '#CA8A04' : '#B91C1C'}1A` }}>
            <Icon size={16} className={color} />
          </div>
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </div>
        {value && (
          <span className={`text-sm font-semibold font-mono-numbers ${color}`}>{value}</span>
        )}
      </div>
      {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      {children}
    </Card>
  )
}

/**
 * Mini progress bar for widgets
 */
function ProgressBar({ value, max, color = '#7C3AED' }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0)
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export default function Dashboard() {
  const { profile } = useAuth()
  const { tasks } = useTasks()
  const { workouts } = useWorkouts()
  const { meals, waterLog } = useNutrition()
  const { transactions } = useFinance()

  const today = getToday()

  // Stats derivations
  const todayTasks = tasks.filter(t => t.due_date === today)
  const todayDone = todayTasks.filter(t => t.completed).length
  const weeklyWorkouts = workouts.filter(w => isThisWeek(w.logged_at)).length
  const todayMeals = meals.filter(m => m.logged_at === today)
  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0)
  const monthExpenses = transactions
    .filter(t => t.type === 'expense' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0)
  const monthlyBudget = profile?.monthly_budget || 0

  const weeklySpending = getLastNDays(7).map((date) => ({
    label: formatDate(date, { month: undefined, year: undefined, weekday: 'short' }),
    amount: transactions
      .filter((t) => t.type === 'expense' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0),
  }))

  // Calculate overall app streak based on any activity
  const allActivityDates = [
    ...tasks.filter(t => t.completed_at).map(t => t.completed_at),
    ...workouts.map(w => w.logged_at),
    ...meals.map(m => m.logged_at),
    ...transactions.map(t => t.date),
  ]
  const { current: streak } = calculateStreak(allActivityDates)

  // "Coming up today" — tasks still due today, meal windows not yet logged,
  // and a workout nudge if the weekly goal isn't met yet.
  const upcomingTasks = todayTasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (a.due_time && b.due_time) return a.due_time.localeCompare(b.due_time)
      if (a.due_time) return -1
      if (b.due_time) return 1
      return 0
    })
  const currentHour = new Date().getHours()
  const missedMeals = MEAL_WINDOWS.filter(
    (w) => currentHour >= w.startHour && !todayMeals.some((m) => m.meal_type === w.type)
  )
  const workoutsToday = workouts.some(w => new Date(w.logged_at).toDateString() === new Date().toDateString())
  const workoutsRemaining = Math.max(0, (profile?.weekly_workout_goal || 4) - weeklyWorkouts)

  return (
    <div className="space-y-8">
      {/* Reminders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 py-4"
      >
        <RemindersPanel
          upcomingTasks={upcomingTasks}
          missedMeals={missedMeals}
          workoutsToday={workoutsToday}
          workoutsRemaining={workoutsRemaining}
        />

        {/* Stat cards row */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <StatCard
            label="Calories today"
            value={caloriesConsumed.toLocaleString()}
            icon={UtensilsCrossed}
            color="text-accent-amber"
          />
          <StatCard
            label="Tasks done"
            value={`${todayDone}/${todayTasks.length}`}
            icon={CheckSquare}
            color="text-accent-purple"
          />
          <StatCard
            label="Current streak"
            value={`${streak} days`}
            icon={Flame}
            color="text-accent-red"
          />
        </div>
      </motion.div>

      {/* Module widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tasks widget */}
        <ModuleWidget
          icon={CheckSquare}
          title="Tasks"
          subtitle="Today's progress"
          value={`${todayDone}/${todayTasks.length}`}
          color="text-accent-purple"
        >
          <ProgressBar value={todayDone} max={todayTasks.length || 1} color="#7C3AED" />
          <div className="space-y-2 mt-2">
            {todayTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-xs">
                <div className={`w-3.5 h-3.5 rounded border ${task.completed ? 'bg-accent-purple/20 border-accent-purple' : 'border-border'}`} />
                <span className={task.completed ? 'text-text-muted line-through' : 'text-text-secondary truncate'}>{task.title}</span>
              </div>
            ))}
            {todayTasks.length === 0 && <span className="text-xs text-text-muted">No tasks today</span>}
          </div>
        </ModuleWidget>

        {/* Workouts widget */}
        <ModuleWidget
          icon={Dumbbell}
          title="Workouts"
          subtitle={`${weeklyWorkouts}/${profile?.weekly_workout_goal || 4} weekly goal`}
          value={`${weeklyWorkouts}/${profile?.weekly_workout_goal || 4}`}
          color="text-accent-green"
        >
          <ProgressBar value={weeklyWorkouts} max={profile?.weekly_workout_goal || 4} color="#B91C1C" />
          {workouts.length > 0 ? (
            <p className="text-xs text-text-muted mt-1">Last: {workouts[0].type} · {new Date(workouts[0].logged_at).toLocaleDateString()}</p>
          ) : (
            <p className="text-xs text-text-muted mt-1">No recent workouts</p>
          )}
        </ModuleWidget>

        {/* Nutrition widget */}
        <ModuleWidget
          icon={UtensilsCrossed}
          title="Nutrition"
          subtitle="Calories remaining"
          value={Math.max(0, (profile?.daily_calorie_goal || 2000) - caloriesConsumed)}
          color="text-accent-amber"
        >
          <ProgressBar value={caloriesConsumed} max={profile?.daily_calorie_goal || 2000} color="#8B5CF6" />
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Droplets size={12} className="text-accent-blue" />
              <span className="text-xs text-text-secondary">{waterLog?.glasses || 0}/8 glasses</span>
            </div>
          </div>
        </ModuleWidget>

        {/* Finance widget */}
        <ModuleWidget
          icon={Wallet}
          title="Finance"
          subtitle="Spent this month"
          value={formatCurrency(monthExpenses, profile?.currency || 'USD')}
          color="text-accent-amber"
        >
          {monthlyBudget > 0 ? (
            <>
              <ProgressBar value={monthExpenses} max={monthlyBudget} color={monthExpenses > monthlyBudget ? '#B91C1C' : '#CA8A04'} />
              <p className="text-xs text-text-muted mt-1">
                {formatCurrency(Math.max(monthlyBudget - monthExpenses, 0), profile?.currency || 'USD')} left of {formatCurrency(monthlyBudget, profile?.currency || 'USD')}
              </p>
            </>
          ) : (
            <p className="text-xs text-text-muted mt-1">No monthly budget set</p>
          )}
        </ModuleWidget>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="h-[300px] flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Wallet size={16} className="text-accent-amber" />
            Spending This Week
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="#6E6877" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6E6877" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#221E27', border: '1px solid #FFFFFF0D', borderRadius: '12px' }}
                  itemStyle={{ color: '#EDEAF0' }}
                  formatter={(val) => formatCurrency(val, profile?.currency || 'USD')}
                />
                <Bar dataKey="amount" fill="#CA8A04" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
