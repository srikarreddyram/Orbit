import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Card from '../../../components/ui/Card'
import { getIconComponent } from './CategoryConfig'
import { formatCurrency } from '../../../utils/currencyHelpers'

export default function CategoryBreakdown({ transactions, categories = [], currency = 'USD', periodLabel = 'This Month' }) {
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
        const catObj = categories.find(c => c.name === cat)
        const color = catObj ? catObj.color : '#6E6877'
        const iconName = catObj ? catObj.icon : 'Package'

        return {
          id: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
          iconName,
          color,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [transactions, categories])

  if (breakdown.length === 0) return null

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-text-primary">Top Categories</h3>
        <span className="text-xs text-text-muted">{periodLabel}</span>
      </div>
      
      <div className="space-y-4">
        {breakdown.slice(0, 6).map((cat, index) => {
          const Icon = getIconComponent(cat.iconName)
          return (
            <div key={cat.id} className="relative">
              <div className="flex justify-between items-end mb-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon size={12} style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm font-medium text-text-secondary capitalize">{cat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{cat.percentage.toFixed(0)}%</span>
                  <span className="text-sm font-mono-numbers font-bold text-text-primary">
                    {formatCurrency(cat.amount, currency)}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${cat.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
