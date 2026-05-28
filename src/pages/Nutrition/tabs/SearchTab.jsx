import { useState, useMemo } from 'react'
import { Search, ScanBarcode, Plus, Sparkles } from 'lucide-react'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'
import useCustomData from '../../../hooks/useCustomData'
import CreateCustomFood from '../components/CreateCustomFood'
import { parseMealLog } from '../../../lib/ai'

// Custom Foods Only

export default function SearchTab({ addMeal }) {
  const { customFoods } = useCustomData()
  const [query, setQuery] = useState('')
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [isAiParsing, setIsAiParsing] = useState(false)

  // Format custom foods
  const combinedDb = useMemo(() => {
    return customFoods.map(f => ({
      id: f.id,
      name: f.name,
      cals: f.calories,
      p: f.protein_g,
      c: f.carbs_g,
      f: f.fat_g,
      serving: f.serving_size,
      isCustom: true
    }))
  }, [customFoods])

  const filtered = query 
    ? combinedDb.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : combinedDb

  const handleQuickAdd = async (food) => {
    try {
      await addMeal({
        meal_type: 'snack', // Defaulting to snack for quick add
        food_name: food.name,
        calories: food.cals,
        protein: food.p,
        carbs: food.c,
        fat: food.f,
      })
      toast.success(`Added ${food.name}`)
    } catch (err) {
      toast.error('Failed to add food')
    }
  }

  const handleAiLog = async () => {
    if (!query.trim()) return
    setIsAiParsing(true)
    
    try {
      const parsedFoods = await parseMealLog(query, customFoods)
      if (parsedFoods && parsedFoods.length > 0) {
        for (const f of parsedFoods) {
          await addMeal({
            meal_type: 'snack',
            food_name: f.food_name,
            calories: f.calories,
            protein: f.protein_g,
            carbs: f.carbs_g,
            fat: f.fat_g,
          })
        }
        toast.success(`Added ${parsedFoods.length} items via AI`)
        setQuery('')
      } else {
        toast.error('AI could not parse that meal')
      }
    } catch (err) {
      console.error(err)
      toast.error('AI Error')
    } finally {
      setIsAiParsing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-surface/50 p-2 rounded-2xl border border-white/5 shadow-sm backdrop-blur-md sticky top-24 z-10">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or describe meal (e.g. 2 eggs and toast)..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-muted"
            autoFocus
          />
        </div>
        
        {query.length > 5 && (
          <button 
            onClick={handleAiLog}
            disabled={isAiParsing}
            className="p-2.5 bg-gradient-to-r from-accent-amber/20 to-accent-amber/10 border border-accent-amber/30 text-accent-amber rounded-xl hover:bg-accent-amber/30 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span className="text-xs font-bold hidden sm:inline">{isAiParsing ? 'Parsing...' : 'AI Log'}</span>
          </button>
        )}
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Food Database</h3>
        <button 
          onClick={() => setShowCustomModal(true)}
          className="text-accent-amber text-sm font-bold flex items-center gap-1 hover:text-white transition-colors"
        >
          <Plus size={16} /> Custom Food
        </button>
      </div>

      {/* Results */}
      {combinedDb.length === 0 ? (
        <div className="p-8 border border-white/5 bg-surface/30 rounded-3xl text-center backdrop-blur-sm flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-accent-amber/10 flex items-center justify-center mb-4">
            <ScanBarcode size={24} className="text-accent-amber" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Food Database Empty</h3>
          <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
            You don't have any custom foods yet. You can create custom foods or use the AI Log to magically add meals!
          </p>
          <Button onClick={() => setShowCustomModal(true)} className="bg-accent-amber text-black px-6 font-bold">
            Create Custom Food
          </Button>
        </div>
      ) : (
        <div className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
          {filtered.map((food, idx) => (
            <div 
              key={food.id || idx}
              className={`flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors ${
                idx !== filtered.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-text-primary">{food.name}</h4>
                  {food.isCustom && <span className="px-1.5 py-0.5 rounded text-[8px] uppercase font-bold bg-white/10 text-text-muted">Custom</span>}
                </div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-1">
                  {food.cals} kcal • {food.serving}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono-numbers text-accent-amber bg-accent-amber/10 px-1.5 py-0.5 rounded">{food.p}g P</span>
                  <span className="text-[10px] font-mono-numbers text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">{food.c}g C</span>
                  <span className="text-[10px] font-mono-numbers text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">{food.f}g F</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleQuickAdd(food)}
                className="w-10 h-10 rounded-full bg-accent-amber/10 text-accent-amber hover:bg-accent-amber hover:text-black flex items-center justify-center transition-all shadow-sm shrink-0"
              >
                <Plus size={20} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-text-muted text-sm flex flex-col items-center">
              <p>No matching foods found.</p>
              <p className="mt-2">Try typing your meal and clicking the AI Sparkle button to auto-log it!</p>
            </div>
          )}
        </div>
      )}

      <CreateCustomFood isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
    </div>
  )
}
