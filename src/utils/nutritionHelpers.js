/**
 * Custom foods store their nutrition per a fixed base amount (e.g. per
 * 100g). These helpers scale that to whatever quantity the user actually
 * logs, e.g. a food defined per 100g logged at 250g gets every nutrient
 * multiplied by 2.5.
 */

export const FOOD_UNITS = [
  { id: 'g', label: 'g' },
  { id: 'ml', label: 'ml' },
  { id: 'oz', label: 'oz' },
  { id: 'serving', label: 'serving' },
]

export const NUTRIENT_FIELDS = ['calories', 'protein_g', 'carbs_g', 'sugar_g', 'fat_g', 'cholesterol_mg']

function round1(n) {
  return Math.round(n * 10) / 10
}

/**
 * Scale a custom food's per-base-amount nutrition to an arbitrary quantity
 * of the same unit.
 */
export function scaleNutrition(food, quantity) {
  const ratio = food.base_amount > 0 ? quantity / food.base_amount : 0
  const scaled = {}
  for (const field of NUTRIENT_FIELDS) {
    scaled[field] = round1((food[field] || 0) * ratio)
  }
  return scaled
}

export function formatBaseAmount(food) {
  return `per ${food.base_amount}${food.base_unit}`
}
