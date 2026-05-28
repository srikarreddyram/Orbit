const badgeColors = {
  purple: 'bg-accent-purple/15 text-accent-purple',
  green: 'bg-accent-green/15 text-accent-green',
  amber: 'bg-accent-amber/15 text-accent-amber',
  red: 'bg-accent-red/15 text-accent-red',
  blue: 'bg-accent-blue/15 text-accent-blue',
  muted: 'bg-surface text-text-secondary',
}

const priorityColors = {
  high: 'red',
  medium: 'amber',
  low: 'blue',
}

const categoryColors = {
  work: 'purple',
  personal: 'blue',
  health: 'green',
  finance: 'amber',
  other: 'muted',
}

export default function Badge({ children, color = 'purple', dot = false, className = '' }) {
  return (
    <span className={`badge ${badgeColors[color] || badgeColors.muted} ${className}`}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            color === 'purple' ? 'bg-accent-purple' :
            color === 'green' ? 'bg-accent-green' :
            color === 'amber' ? 'bg-accent-amber' :
            color === 'red' ? 'bg-accent-red' :
            color === 'blue' ? 'bg-accent-blue' :
            'bg-text-muted'
          }`}
        />
      )}
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const color = priorityColors[priority] || 'muted'
  return <Badge color={color}>{priority}</Badge>
}

export function CategoryBadge({ category }) {
  const color = categoryColors[category] || 'muted'
  return <Badge color={color} dot>{category}</Badge>
}
