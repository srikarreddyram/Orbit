import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import Card from '../../../components/ui/Card'
import { getIconComponent } from './CategoryConfig'
import { formatCurrency } from '../../../utils/currencyHelpers'

const RADIAN = Math.PI / 180

export default function CategoryDonut({ transactions, categories = [], currency = 'USD' }) {
  const breakdown = useMemo(() => {
    const spending = {}
    let total = 0

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        spending[t.category] = (spending[t.category] || 0) + t.amount
        total += t.amount
      })

    return Object.entries(spending)
      .map(([cat, amount]) => {
        const catObj = categories.find((c) => c.name === cat)
        return {
          id: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
          iconName: catObj ? catObj.icon : 'Package',
          color: catObj ? catObj.color : '#6E6877',
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [transactions, categories])

  const total = breakdown.reduce((sum, c) => sum + c.amount, 0)

  if (breakdown.length === 0) return null

  const renderCategoryIcon = ({ cx, cy, midAngle, outerRadius, index }) => {
    const cat = breakdown[index]
    const radius = outerRadius - 16
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const Icon = getIconComponent(cat.iconName)

    return (
      <g key={cat.id} transform={`translate(${x}, ${y})`}>
        <circle r={13} fill={cat.color} stroke="#0B0A0C" strokeWidth={2} />
        <Icon x={-6.5} y={-6.5} width={13} height={13} color="#fff" strokeWidth={2.5} />
      </g>
    )
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-bold text-text-primary mb-4">Spending by Category</h3>
      <div className="relative w-full max-w-[240px] mx-auto aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              dataKey="amount"
              nameKey="label"
              innerRadius="62%"
              outerRadius="82%"
              paddingAngle={breakdown.length > 1 ? 3 : 0}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              label={renderCategoryIcon}
              labelLine={false}
              isAnimationActive={false}
            >
              {breakdown.map((cat) => (
                <Cell key={cat.id} fill={cat.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">Spent</span>
          <span className="text-lg font-bold font-mono-numbers text-text-primary">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    </Card>
  )
}
