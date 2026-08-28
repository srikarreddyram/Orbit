// Per-kg daily ceilings for macros that don't have their own explicit user
// goal. These are general nutrition heuristics (not personalized medical
// advice) used only to decide streak eligibility: carbs at the upper end of
// typical moderate-carb guidance, fat as a generous cap, sugar close to the
// AHA/WHO ~25-36g/day guidance once scaled to an average adult, and
// cholesterol close to the common 300mg/day cap.
const CARBS_G_PER_KG = 5
const FAT_G_PER_KG = 1.5
const SUGAR_G_PER_KG = 0.5
const CHOLESTEROL_MG_PER_KG = 4

const DEFAULT_WEIGHT_KG = 70

/**
 * Groups meals by logged_at date and sums their macros.
 * @returns {Record<string, { calories: number, protein_g: number, carbs_g: number, fat_g: number, sugar_g: number, cholesterol_mg: number }>}
 */
function sumMealsByDay(meals) {
  const byDay = {}
  for (const m of meals) {
    const day = m.logged_at
    if (!day) continue
    if (!byDay[day]) {
      byDay[day] = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sugar_g: 0, cholesterol_mg: 0 }
    }
    byDay[day].calories += Number(m.calories) || 0
    byDay[day].protein_g += Number(m.protein_g) || 0
    byDay[day].carbs_g += Number(m.carbs_g) || 0
    byDay[day].fat_g += Number(m.fat_g) || 0
    byDay[day].sugar_g += Number(m.sugar_g) || 0
    byDay[day].cholesterol_mg += Number(m.cholesterol_mg) || 0
  }
  return byDay
}

/**
 * A day "hits" its nutrition goals when calories stayed at or under target,
 * protein met or exceeded target, and the other macros stayed under a
 * body-weight-scaled ceiling. Returns the sorted list of qualifying date
 * strings, ready to feed into calculateStreak().
 */
export function getQualifyingNutritionDays(meals, { calorieGoal, proteinGoal, weightKg }) {
  const weight = weightKg || DEFAULT_WEIGHT_KG
  const ceilings = {
    carbs_g: CARBS_G_PER_KG * weight,
    fat_g: FAT_G_PER_KG * weight,
    sugar_g: SUGAR_G_PER_KG * weight,
    cholesterol_mg: CHOLESTEROL_MG_PER_KG * weight,
  }

  const byDay = sumMealsByDay(meals)

  return Object.entries(byDay)
    .filter(([, totals]) => (
      totals.calories > 0 &&
      totals.calories <= calorieGoal &&
      totals.protein_g >= proteinGoal &&
      totals.carbs_g <= ceilings.carbs_g &&
      totals.fat_g <= ceilings.fat_g &&
      totals.sugar_g <= ceilings.sugar_g &&
      totals.cholesterol_mg <= ceilings.cholesterol_mg
    ))
    .map(([day]) => day)
    .sort()
}
