import { useMemo } from 'react'
import { Plus, Coffee, Sun, Moon, Droplet, PlusCircle } from 'lucide-react'

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#C2872A' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: '#2DD4BF' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: '#38BDF8' },
  { id: 'snack', label: 'Snacks', icon: PlusCircle, color: '#8B5CF6' },
]

export default function LogTab({ data, updateWater, waterGoalGlasses, onLogFood }) {
  const { meals, water_ml, water_glasses } = data

  const groupedMeals = useMemo(() => {
    const grouped = { breakfast: [], lunch: [], dinner: [], snack: [] }
    meals?.forEach(m => {
      if (grouped[m.meal_type]) {
        grouped[m.meal_type].push(m)
      } else {
        grouped.snack.push(m)
      }
    })
    return grouped
  }, [meals])

  const handleAddWater = () => {
    updateWater(water_glasses + 1)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      
      {MEAL_TYPES.map(type => {
        const typeMeals = groupedMeals[type.id]
        const typeCals = typeMeals.reduce((sum, m) => sum + m.calories, 0)
        const Icon = type.icon

        return (
          <div key={type.id} className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${type.color}15`, border: `1px solid ${type.color}30` }}
                >
                  <Icon size={18} style={{ color: type.color }} />
                </div>
                <h3 className="font-bold text-text-primary">{type.label}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold font-mono-numbers text-text-primary">{typeCals} <span className="text-xs text-text-muted font-sans font-normal">kcal</span></span>
                <button
                  onClick={() => onLogFood(type.id)}
                  className="w-8 h-8 rounded-full bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 flex items-center justify-center transition-colors"
                  aria-label={`Add food to ${type.label}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Food List */}
            <div className="p-2">
              {typeMeals.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-text-muted">No foods logged yet.</p>
                </div>
              ) : (
                typeMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{meal.food_item}</h4>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-0.5">
                        {meal.protein_g}g P • {meal.carbs_g}g C • {meal.fat_g}g F
                        {(meal.sugar_g > 0 || meal.cholesterol_mg > 0) && ' • '}
                        {meal.sugar_g > 0 && `${meal.sugar_g}g Sugar`}
                        {meal.sugar_g > 0 && meal.cholesterol_mg > 0 && ' • '}
                        {meal.cholesterol_mg > 0 && `${meal.cholesterol_mg}mg Chol`}
                      </p>
                    </div>
                    <span className="text-sm font-mono-numbers font-semibold text-text-secondary">{meal.calories}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}

      {/* Water Quick Add */}
      <div className="bg-surface/30 border border-white/5 rounded-3xl p-4 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center shadow-sm border border-accent-blue/20">
            <Droplet size={20} className="text-accent-blue" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Water</h3>
            <p className="text-xs text-text-muted mt-0.5 font-mono-numbers">
              {water_ml} / {waterGoalGlasses * 250} ml &middot; {water_glasses}/{waterGoalGlasses} glasses
            </p>
          </div>
        </div>
        <button 
          onClick={handleAddWater}
          className="px-4 py-2 bg-accent-blue/10 text-accent-blue text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-accent-blue/20 transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> 250ml
        </button>
      </div>

    </div>
  )
}
