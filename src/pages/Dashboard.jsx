import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import {
  CheckSquare,
  Dumbbell,
  Moon,
  UtensilsCrossed,
  Target,
  TrendingUp,
  Flame,
  Droplets,
} from 'lucide-react'
import Card, { StatCard } from '../components/ui/Card'
import { SkeletonCard } from '../components/ui/Skeleton'
import useLifeScore from '../hooks/useLifeScore'
import useAuth from '../hooks/useAuth'
import useTasks from '../hooks/useTasks'
import useWorkouts from '../hooks/useWorkouts'
import useSleep from '../hooks/useSleep'
import useNutrition from '../hooks/useNutrition'
import useHabits from '../hooks/useHabits'
import useMood from '../hooks/useMood'
import { getToday, isThisWeek } from '../utils/dateHelpers'
import { calculateStreak } from '../utils/streakCalculator'

/**
 * LifeScore Ring Gauge Component
 */
function LifeScoreRing({ score = 0, size = 200, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 70) return '#34d399'
    if (s >= 40) return '#f59e0b'
    return '#f87171'
  }

  const color = getColor(score)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-3xl font-semibold font-mono-numbers text-text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-text-muted uppercase tracking-wider">LifeScore</span>
      </div>
    </div>
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
            style={{ backgroundColor: `${color === 'text-accent-purple' ? '#7c6af7' : color === 'text-accent-green' ? '#34d399' : color === 'text-accent-blue' ? '#60a5fa' : color === 'text-accent-amber' ? '#f59e0b' : '#f87171'}15` }}>
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
function ProgressBar({ value, max, color = '#7c6af7' }) {
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
  const { overall } = useLifeScore()
  const { tasks } = useTasks()
  const { workouts } = useWorkouts()
  const { sleepLogs } = useSleep()
  const { meals, waterLog } = useNutrition()
  const { habits, completions } = useHabits()
  const { moodLogs } = useMood()

  const today = getToday()

  // Stats derivations
  const todayTasks = tasks.filter(t => t.due_date === today)
  const todayDone = todayTasks.filter(t => t.completed).length
  const weeklyWorkouts = workouts.filter(w => isThisWeek(w.logged_at)).length
  const lastSleep = sleepLogs[sleepLogs.length - 1]
  const todayMeals = meals.filter(m => m.logged_at === today)
  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0)
  const todayMood = moodLogs.find(m => m.logged_at.startsWith(today))
  const todayHabitsDone = completions.filter(c => c.completed_on === today).length

  // Calculate overall app streak based on any activity
  const allActivityDates = [
    ...tasks.filter(t => t.completed_at).map(t => t.completed_at),
    ...workouts.map(w => w.logged_at),
    ...sleepLogs.map(s => s.logged_at),
    ...meals.map(m => m.logged_at),
    ...completions.map(c => c.completed_on),
    ...moodLogs.map(m => m.logged_at)
  ]
  const { current: streak } = calculateStreak(allActivityDates)

  return (
    <div className="space-y-8">
      {/* LifeScore Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 py-4"
      >
        <LifeScoreRing score={overall} size={200} />

        {/* Stat cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <StatCard
            label="Sleep (last night)"
            value={lastSleep ? `${lastSleep.duration_hours}h` : 'No data'}
            icon={Moon}
            color="text-accent-blue"
          />
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
          <ProgressBar value={todayDone} max={todayTasks.length || 1} color="#7c6af7" />
          <div className="space-y-2 mt-2">
            {todayTasks.slice(0, 3).map((task, i) => (
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
          <ProgressBar value={weeklyWorkouts} max={profile?.weekly_workout_goal || 4} color="#34d399" />
          {workouts.length > 0 ? (
            <p className="text-xs text-text-muted mt-1">Last: {workouts[0].type} · {new Date(workouts[0].logged_at).toLocaleDateString()}</p>
          ) : (
            <p className="text-xs text-text-muted mt-1">No recent workouts</p>
          )}
        </ModuleWidget>

        {/* Sleep widget */}
        <ModuleWidget
          icon={Moon}
          title="Sleep"
          subtitle="Last night"
          value={lastSleep ? `${lastSleep.duration_hours}h` : 'No data'}
          color="text-accent-blue"
        >
          {lastSleep && (
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {lastSleep.quality >= 4 ? '😊' : lastSleep.quality <= 2 ? '😩' : '😐'}
              </span>
              <span className="text-xs text-text-secondary">Quality: {lastSleep.quality}/5</span>
            </div>
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
          <ProgressBar value={caloriesConsumed} max={profile?.daily_calorie_goal || 2000} color="#f59e0b" />
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Droplets size={12} className="text-accent-blue" />
              <span className="text-xs text-text-secondary">{waterLog?.glasses || 0}/8 glasses</span>
            </div>
          </div>
        </ModuleWidget>

        {/* Habits widget */}
        <ModuleWidget
          icon={Target}
          title="Habits"
          subtitle="Today's completion"
          value={`${todayHabitsDone}/${habits.length}`}
          color="text-accent-green"
        >
          <div className="flex gap-2 flex-wrap mt-1">
            {habits.length > 0 ? habits.map((habit) => {
              const done = completions.some(c => c.habit_id === habit.id && c.completed_on === today)
              return (
                <div
                  key={habit.id}
                  title={habit.name}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                    ${done ? 'bg-accent-green/15' : 'bg-surface border border-border opacity-50'}`}
                >
                  {habit.emoji}
                </div>
              )
            }) : (
              <span className="text-xs text-text-muted">No habits defined</span>
            )}
          </div>
        </ModuleWidget>

        {/* Mood widget */}
        <ModuleWidget
          icon={TrendingUp}
          title="Mood"
          subtitle="Today"
          color="text-accent-amber"
        >
          <div className="flex items-center gap-2">
            {todayMood ? (
              <>
                <span className="text-2xl">
                  {todayMood.mood === 5 ? '😄' : todayMood.mood === 4 ? '🙂' : todayMood.mood === 3 ? '😐' : todayMood.mood === 2 ? '😔' : '😩'}
                </span>
                <div>
                  <p className="text-sm text-text-primary">Logged today</p>
                  <p className="text-xs text-text-muted">Energy: {todayMood.energy}/5</p>
                </div>
              </>
            ) : (
              <span className="text-sm text-text-muted">No mood logged today</span>
            )}
          </div>
        </ModuleWidget>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-[300px] flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Moon size={16} className="text-accent-blue" />
            Sleep Duration Trend
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepLogs.slice(-7)}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="logged_at" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'short' })} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="duration_hours" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-[300px] flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-amber" />
            Mood & Energy
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodLogs.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="logged_at" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'short' })} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 5]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="mood" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="energy" fill="#7c6af7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
