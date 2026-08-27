import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Droplet, Flame, Candy, HeartPulse } from 'lucide-react'

export default function DashboardTab({ data, profile, waterGoalGlasses = 8 }) {
  // Use DB targets or fallbacks
  const targetCalories = profile?.daily_calorie_goal || 2500
  const targets = {
    protein: Math.round((targetCalories * 0.3) / 4), // 30% protein
    carbs: Math.round((targetCalories * 0.4) / 4),   // 40% carbs
    fat: Math.round((targetCalories * 0.3) / 9),     // 30% fat
  }

  const {
    total_calories: cals,
    total_protein: p,
    total_carbs: c,
    total_sugar: sugar,
    total_fat: f,
    total_cholesterol: chol,
    water_ml,
  } = data

  const macroData = useMemo(() => [
    { name: 'Protein', value: p, color: '#C2872A' },
    { name: 'Carbs', value: c, color: '#2DD4BF' },
    { name: 'Fat', value: f, color: '#38BDF8' },
    { name: 'Remaining', value: Math.max(0, targetCalories - cals), color: '#2A2530' }
  ], [p, c, f, cals, targetCalories])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Main Macro Ring */}
      <div className="bg-surface/30 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-amber/20 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
                cornerRadius={8}
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Flame size={24} className="text-accent-amber mb-1" />
            <span className="text-4xl font-bold font-mono-numbers text-text-primary leading-none">
              {cals}
            </span>
            <span className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">
              / {targetCalories} kcal
            </span>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="w-full grid grid-cols-3 gap-6 mt-8">
          {[
            { label: 'Protein', spent: p, target: targets.protein, color: '#C2872A' },
            { label: 'Carbs', spent: c, target: targets.carbs, color: '#2DD4BF' },
            { label: 'Fat', spent: f, target: targets.fat, color: '#38BDF8' },
          ].map(macro => {
            const pct = Math.min((macro.spent / macro.target) * 100, 100)
            return (
              <div key={macro.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-text-secondary">{macro.label}</span>
                  <span className="text-[10px] text-text-muted font-mono-numbers">{macro.spent} / {macro.target}g</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, backgroundColor: macro.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sugar / Cholesterol — tracked separately from the calorie pie since
          sugar is a subset of carbs and cholesterol carries no calories */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface/30 border border-white/5 rounded-3xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cursed-purple/10 flex items-center justify-center border border-cursed-purple/20 shrink-0">
            <Candy size={20} className="text-cursed-purple" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Sugar</p>
            <p className="text-xl font-bold font-mono-numbers text-text-primary">{sugar}<span className="text-sm text-text-muted font-sans font-normal ml-1">g</span></p>
          </div>
        </div>
        <div className="bg-surface/30 border border-white/5 rounded-3xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blood/10 flex items-center justify-center border border-blood/20 shrink-0">
            <HeartPulse size={20} className="text-blood" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Cholesterol</p>
            <p className="text-xl font-bold font-mono-numbers text-text-primary">{chol}<span className="text-sm text-text-muted font-sans font-normal ml-1">mg</span></p>
          </div>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30 shadow-[0_0_15px_rgba(96,165,250,0.2)]">
            <Droplet size={24} className="text-accent-blue" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-lg">Hydration</h3>
            <p className="text-sm text-text-muted">Daily Goal: {waterGoalGlasses * 250} ml</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold font-mono-numbers text-text-primary">{water_ml}</span>
          <span className="text-sm text-text-muted ml-1 font-mono-numbers">ml</span>
        </div>
      </div>
    </div>
  )
}
