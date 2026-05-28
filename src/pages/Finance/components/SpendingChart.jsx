import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import Card from '../../../components/ui/Card'
import { formatCurrency, getCurrencySymbol } from '../../../utils/currencyHelpers'

export default function SpendingChart({ transactions, monthlyBudget, currency = 'USD' }) {
  // Generate a realistic spending curve from actual transactions
  const spendingCurve = useMemo(() => {
    // Get the current month and year
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const currentDay = now.getDate()

    // Filter to just this month's expenses
    const thisMonthExpenses = transactions.filter(t => {
      if (t.type !== 'expense') return false
      const d = new Date(t.logged_at)
      return d.getMonth() === month && d.getFullYear() === year
    })

    let cumulative = 0
    const data = []

    for (let i = 1; i <= daysInMonth; i++) {
      if (i <= currentDay) {
        // Sum expenses for this specific day
        const dayExpenses = thisMonthExpenses
          .filter(t => new Date(t.logged_at).getDate() === i)
          .reduce((sum, t) => sum + t.amount, 0)
        
        cumulative += dayExpenses
      }

      data.push({
        day: i,
        spent: i <= currentDay ? cumulative : null, // null prevents drawing the line into the future
      })
    }

    return data
  }, [transactions])

  const currentSpent = spendingCurve.reduce((max, d) => Math.max(max, d.spent || 0), 0)
  const isOverBudget = currentSpent > monthlyBudget
  
  // Use a premium purple/blue gradient or red if over budget
  const gradientColors = isOverBudget 
    ? { top: '#ef4444', bottom: '#f87171' } 
    : { top: '#6366f1', bottom: '#8b5cf6' }

  return (
    <Card className="overflow-hidden relative p-0 pt-5">
      <div className="px-5 mb-4 flex justify-between items-end">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Spending Trend</h3>
          <p className="text-xs text-text-muted mt-0.5">Cumulative expenses this month</p>
        </div>
      </div>
      
      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spendingCurve} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors.top} stopOpacity={0.4} />
                <stop offset="95%" stopColor={gradientColors.bottom} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6b6b8a', fontSize: 10, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
              minTickGap={20}
            />
            <YAxis 
              tick={{ fill: '#6b6b8a', fontSize: 10, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${getCurrencySymbol(currency)}${val}`}
            />
            {monthlyBudget > 0 && (
              <ReferenceLine 
                y={monthlyBudget} 
                stroke="#6b6b8a" 
                strokeDasharray="4 4" 
                strokeOpacity={0.3} 
                label={{ 
                  position: 'insideTopRight',
                  value: 'Budget', 
                  fill: '#6b6b8a', 
                  fontSize: 10,
                  offset: 10
                }} 
              />
            )}
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={({ active, payload }) =>
                active && payload?.[0]?.value != null ? (
                  <div className="bg-surface/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
                    <p className="text-[10px] text-text-muted font-medium mb-1 uppercase tracking-wider">Day {payload[0].payload.day}</p>
                    <p className="font-mono-numbers font-bold text-lg text-text-primary">
                      {formatCurrency(payload[0].value, currency)}
                    </p>
                  </div>
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke={gradientColors.top}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSpent)"
              connectNulls={false}
              activeDot={{ r: 6, fill: gradientColors.top, stroke: '#12121a', strokeWidth: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
