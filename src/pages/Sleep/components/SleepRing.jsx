import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function SleepRing({ log }) {
  const score = log.recovery_score || Math.round(((log.quality || 3) / 5) * 100);
  
  // Data for the ring
  const data = [
    { name: 'Score', value: score, color: '#38BDF8' },
    { name: 'Remaining', value: 100 - score, color: 'rgba(255,255,255,0.05)' }
  ]

  let ringColor = '#38BDF8'
  if (score >= 85) ringColor = '#7C3AED'
  else if (score < 70) ringColor = '#C2872A'
  else if (score < 50) ringColor = '#B91C1C'

  data[0].color = ringColor

  return (
    <div className="bg-surface/30 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 blur-[80px] rounded-full pointer-events-none opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: ringColor }}
      />
      
      <div className="relative w-64 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={95}
              outerRadius={115}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Activity size={24} style={{ color: ringColor }} className="mb-2" />
          <span className="text-5xl font-bold font-mono-numbers text-text-primary leading-none tracking-tighter">
            {score}
          </span>
          <span className="text-xs text-text-muted mt-2 uppercase tracking-wider font-bold">
            Recovery
          </span>
        </div>
      </div>
    </div>
  )
}
