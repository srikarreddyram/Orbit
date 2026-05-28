export default function Skeleton({ className = '', variant = 'rect', width, height }) {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
    title: 'rounded h-6 w-3/4',
    avatar: 'rounded-full w-10 h-10',
    card: 'rounded-card h-32',
    chart: 'rounded-card h-48',
  }

  return (
    <div
      className={`skeleton ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="title" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  )
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
          <Skeleton variant="circle" width={32} height={32} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return <Skeleton variant="chart" className="w-full" />
}
