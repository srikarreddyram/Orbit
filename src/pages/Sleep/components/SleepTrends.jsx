import { useMemo } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function SleepTrends({ sleepData }) {
  const chartData = useMemo(() => {
    // Show last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const log = sleepData.find(s => s.logged_at === dateStr)
      
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        hours: log ? Number((log.duration_hours || 0).toFixed(1)) : 0,
        score: log ? (log.recovery_score || log.quality * 20) : 0
      })
    }
    return days
  }, [sleepData])

  return (
    <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md h-64 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6E6877', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-surface border border-white/10 p-3 rounded-xl shadow-xl">
                    <p className="text-sm font-bold text-text-primary mb-1">{data.day}</p>
                    <p className="text-xl font-bold font-mono-numbers text-accent-blue">{data.hours}h</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="hours" radius={[6, 6, 6, 6]} maxBarSize={40}>
            {chartData.map((entry, index) => {
              // Color based on hours (8h+ is optimal)
              let color = '#38BDF8' // normal — cursed blue
              if (entry.hours >= 8) color = '#7C3AED'
              else if (entry.hours < 6) color = '#C2872A'
              else if (entry.hours === 0) color = '#2A2530'
              
              return <Cell key={`cell-${index}`} fill={color} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
