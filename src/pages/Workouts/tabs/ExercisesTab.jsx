import { useState } from 'react'
import { Search, Dumbbell, Plus } from 'lucide-react'
import useCustomData from '../../../hooks/useCustomData'
import CreateCustomExercise from '../components/CreateCustomExercise'
import Button from '../../../components/ui/Button'

export default function ExercisesTab() {
  const { customExercises, loadingExercises } = useCustomData()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = customExercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) || 
    ex.muscle_group.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-3 bg-surface/50 p-2 rounded-2xl border border-white/5 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search custom exercises..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="p-2.5 bg-elevated rounded-xl border border-white/5 text-text-muted hover:text-text-primary transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {!loadingExercises && customExercises.length === 0 ? (
        <div className="p-8 border border-white/5 bg-surface/30 rounded-3xl text-center backdrop-blur-sm flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
            <Dumbbell size={24} className="text-accent-purple" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No custom exercises</h3>
          <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
            You haven't added any custom exercises yet. Create your first one to start tracking it in workouts.
          </p>
          <Button onClick={() => setShowCreate(true)} className="bg-accent-purple text-white px-6">
            Create Exercise
          </Button>
        </div>
      ) : (
        <div className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
          {filtered.map((ex, idx) => (
            <div 
              key={ex.id}
              className={`flex items-center p-4 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                idx !== filtered.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center mr-4">
                <Dumbbell size={20} className="text-accent-purple" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary">{ex.name}</h4>
                <p className="text-xs text-text-muted capitalize">{ex.muscle_group} • {ex.equipment || 'No Equipment'}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && customExercises.length > 0 && (
            <div className="p-8 text-center text-text-muted text-sm">
              No exercises match your search.
            </div>
          )}
        </div>
      )}

      {showCreate && <CreateCustomExercise onClose={() => setShowCreate(false)} />}
    </div>
  )
}
