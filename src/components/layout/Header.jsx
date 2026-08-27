import { Plus } from 'lucide-react'
import { getGreeting, formatDate } from '../../utils/dateHelpers'
import useAuth from '../../hooks/useAuth'
import useStore from '../../store/useStore'

export default function Header() {
  const { profile } = useAuth()
  const { openQuickAdd } = useStore()

  const greeting = getGreeting()
  const today = formatDate(new Date(), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const name = profile?.name || 'there'

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center justify-between px-5 md:px-8 h-16">
        {/* Greeting */}
        <div>
          <h1 className="text-base md:text-lg font-semibold text-text-primary">
            {greeting}, {name}
          </h1>
          <p className="text-xs text-text-muted">{today}</p>
        </div>

        {/* Quick add button */}
        <button
          onClick={() => openQuickAdd()}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-pill bg-cursed-purple/10 text-cursed-purple text-sm font-medium hover:bg-cursed-purple/20 active:scale-[0.98] transition-all duration-150"
          aria-label="Quick add"
        >
          <Plus size={16} />
          Quick Add
        </button>
      </div>
    </header>
  )
}
