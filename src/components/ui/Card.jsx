import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true, padding = true, animated = false, onClick, ...props }) {
  const content = (
    <div
      className={`card ${padding ? 'p-5' : ''} ${hover ? 'cursor-default' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )

  if (!animated) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  )
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, color = 'text-accent-purple', className = '' }) {
  return (
    <Card className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        {Icon && <Icon size={18} className="text-text-muted" />}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-xl font-semibold font-mono-numbers ${color}`}>{value}</span>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trendUp ? 'text-accent-green' : 'text-accent-red'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </Card>
  )
}
