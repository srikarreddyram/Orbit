import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ScanBarcode, Plus, Sparkles, X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'
import useCustomData from '../../../hooks/useCustomData'
import CreateCustomFood from '../components/CreateCustomFood'
import { parseMealLog } from '../../../lib/ai'
import { inferMealType } from '../mealTiming'
import { scaleNutrition, formatBaseAmount } from '../../../utils/nutritionHelpers'

// Custom Foods Only

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
]

/**
 * "How much did you have?" step — scales a custom food's per-base-amount
 * nutrition to the quantity actually logged before it's added as a meal.
 */
function LogQuantitySheet({ food, mealType, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(String(food.base_amount))
  const parsedQty = parseFloat(quantity) || 0
  const scaled = useMemo(() => scaleNutrition(food, parsedQty), [food, parsedQty])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="pointer-events-auto w-full md:w-[400px] max-h-[90vh] overflow-y-auto bg-elevated border border-white/10 md:rounded-3xl rounded-t-3xl shadow-2xl p-6 md:m-4"
      >
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold text-white">{food.name}</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-xs text-text-muted mb-6">Nutrition {formatBaseAmount(food)} · logging to {mealType}</p>

        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
          How much did you have? ({food.base_unit})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          autoFocus
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-mono-numbers focus:outline-none focus:border-accent-amber mb-6"
        />

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-surface/60 rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-mono-numbers text-text-primary">{scaled.calories}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">kcal</p>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-mono-numbers text-accent-amber">{scaled.protein_g}g</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Protein</p>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-mono-numbers text-cursed-blue">{scaled.fat_g}g</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Fat</p>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 text-center">
            <p className="text-sm font-bold font-mono-numbers text-text-primary">{scaled.carbs_g}g</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Carbs</p>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 text-center">
            <p className="text-sm font-bold font-mono-numbers text-text-primary">{scaled.sugar_g}g</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Sugar</p>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 text-center">
            <p className="text-sm font-bold font-mono-numbers text-text-primary">{scaled.cholesterol_mg}mg</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Cholest.</p>
          </div>
        </div>

        <button
          onClick={() => onConfirm(scaled, parsedQty)}
          disabled={parsedQty <= 0}
          className="w-full py-4 bg-accent-amber hover:bg-accent-amber/90 text-black font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          Add to {mealType}
        </button>
      </motion.div>
      </div>
    </>
  )
}

export default function SearchTab({ addMeal, mealType }) {
  const { customFoods } = useCustomData()
  const [query, setQuery] = useState('')
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [isAiParsing, setIsAiParsing] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState(() => mealType || inferMealType())
  const [loggingFood, setLoggingFood] = useState(null)

  // Format custom foods
  const combinedDb = useMemo(() => {
    return customFoods.map(f => ({
      id: f.id,
      name: f.name,
      cals: f.calories,
      p: f.protein_g,
      c: f.carbs_g,
      f: f.fat_g,
      base_amount: f.base_amount,
      base_unit: f.base_unit,
      calories: f.calories,
      protein_g: f.protein_g,
      carbs_g: f.carbs_g,
      sugar_g: f.sugar_g,
      fat_g: f.fat_g,
      cholesterol_mg: f.cholesterol_mg,
      isCustom: true
    }))
  }, [customFoods])

  const filtered = query
    ? combinedDb.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : combinedDb

  const handleConfirmLog = async (scaled, quantity) => {
    try {
      await addMeal({
        meal_type: selectedMealType,
        food_item: `${loggingFood.name} (${quantity}${loggingFood.base_unit})`,
        calories: scaled.calories,
        protein_g: scaled.protein_g,
        carbs_g: scaled.carbs_g,
        sugar_g: scaled.sugar_g,
        fat_g: scaled.fat_g,
        cholesterol_mg: scaled.cholesterol_mg,
      })
      toast.success(`Added ${loggingFood.name} to ${selectedMealType}`)
      setLoggingFood(null)
    } catch {
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
            meal_type: selectedMealType,
            food_item: f.food_name,
            calories: f.calories,
            protein_g: f.protein_g,
            carbs_g: f.carbs_g,
            sugar_g: f.sugar_g,
            fat_g: f.fat_g,
            cholesterol_mg: f.cholesterol_mg,
          })
        }
        toast.success(`Added ${parsedFoods.length} item${parsedFoods.length === 1 ? '' : 's'} via AI`)
        setQuery('')
      } else {
        toast.error('AI could not parse that meal')
      }
    } catch {
      toast.error('AI Error')
    } finally {
      setIsAiParsing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Meal type selector — determines which meal newly-logged food is filed under */}
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">Log to</span>
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {MEAL_TYPES.map((mt) => (
            <button
              key={mt.id}
              onClick={() => setSelectedMealType(mt.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMealType === mt.id
                  ? 'bg-accent-amber text-black'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              {mt.label}
            </button>
          ))}
        </div>
      </div>

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
                  {food.cals} kcal • {formatBaseAmount(food)}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-mono-numbers text-accent-amber bg-accent-amber/10 px-1.5 py-0.5 rounded">{food.p}g P</span>
                  <span className="text-[10px] font-mono-numbers text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">{food.c}g C</span>
                  <span className="text-[10px] font-mono-numbers text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">{food.f}g F</span>
                  {food.sugar_g > 0 && <span className="text-[10px] font-mono-numbers text-cursed-purple bg-cursed-purple/10 px-1.5 py-0.5 rounded">{food.sugar_g}g Sugar</span>}
                  {food.cholesterol_mg > 0 && <span className="text-[10px] font-mono-numbers text-blood bg-blood/10 px-1.5 py-0.5 rounded">{food.cholesterol_mg}mg Chol</span>}
                </div>
              </div>

              <button
                onClick={() => setLoggingFood(food)}
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

      <AnimatePresence>
        {loggingFood && (
          <LogQuantitySheet
            food={loggingFood}
            mealType={selectedMealType}
            onClose={() => setLoggingFood(null)}
            onConfirm={handleConfirmLog}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
