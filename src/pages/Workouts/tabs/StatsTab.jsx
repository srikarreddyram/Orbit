import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Trophy, TrendingUp, Clock, Flame } from 'lucide-react'

// Demo volume
const weeklyVolume = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  volume: Math.floor(10000 + Math.random() * 8000),
}))

export default function StatsTab({ workouts, prs }) {
  // Stats
  const stats = useMemo(() => {
    if (workouts.length === 0) return { volume: 0, avgDuration: 0, cals: 0 }
    
    let totalCals = 0
    let totalDuration = 0
    let totalVol = 0
    
    workouts.forEach(w => {
      totalCals += (w.calories_burned || 0)
      totalDuration += (w.duration_minutes || 0)
      if (w.sets) {
        w.sets.forEach(s => {
          totalVol += (s.sets || 0) * (s.reps || 0) * (s.weight_kg || 0)
        })
      }
    })
    
    return {
      volume: totalVol,
      avgDuration: Math.round(totalDuration / workouts.length),
      cals: totalCals,
      totalWorkouts: workouts.length
    }
  }, [workouts])

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* High-level stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col gap-2">
          <TrendingUp size={20} className="text-accent-purple" />
          <span className="text-2xl font-bold font-mono-numbers">{(stats.volume / 1000).toFixed(1)}k</span>
          <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Total Vol (kg)</span>
        </div>
        <div className="p-5 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col gap-2">
          <Clock size={20} className="text-emerald-400" />
          <span className="text-2xl font-bold font-mono-numbers">{stats.avgDuration}</span>
          <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Avg Min</span>
        </div>
        <div className="p-5 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col gap-2">
          <Flame size={20} className="text-accent-amber" />
          <span className="text-2xl font-bold font-mono-numbers">{stats.cals}</span>
          <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Total Cals</span>
        </div>
        <div className="p-5 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col gap-2">
          <Trophy size={20} className="text-accent-blue" />
          <span className="text-2xl font-bold font-mono-numbers">{stats.totalWorkouts}</span>
          <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Workouts</span>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="p-6 rounded-3xl bg-surface/40 border border-white/5 backdrop-blur-md min-w-0">
        <h3 className="text-sm font-bold text-text-primary mb-6">Volume Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2530" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#6E6877', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6E6877', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="bg-surface/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
                      <p className="font-mono-numbers font-bold text-text-primary text-lg">{payload[0].value.toLocaleString()} kg</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="volume" fill="#7C3AED" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PR Board */}
      {prs && prs.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 px-2">Personal Records</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prs.map((pr) => (
              <div key={pr.exercise_name} className="bg-surface/30 rounded-2xl p-4 border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Trophy size={40} className="text-accent-amber transform translate-x-2 -translate-y-2 rotate-12" />
                </div>
                <p className="text-xs text-text-muted mb-1 relative z-10">{pr.exercise_name}</p>
                <p className="text-2xl font-bold font-mono-numbers text-accent-amber relative z-10">
                  {pr.value}<span className="text-sm text-text-muted ml-1">{pr.record_type === 'weight' ? 'kg' : ''}</span>
                </p>
                <p className="text-[10px] text-text-muted mt-2 relative z-10 uppercase tracking-wider font-semibold">
                  {new Date(pr.achieved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
