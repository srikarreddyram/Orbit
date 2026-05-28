/**
 * Standard Fitness Engine Utilities
 * These are used as fallbacks when the AI is unavailable, or as baseline 
 * calculations for the AI to factor in.
 */

// Mifflin-St Jeor Equation for Basal Metabolic Rate
export const calculateBMR = (weightKg, heightCm, age, gender) => {
  if (!weightKg || !heightCm || !age) return 2000 // Default generic fallback
  
  // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
  return gender === 'female' ? base - 161 : base + 5
}

// Activity multipliers
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderately_active
  return Math.round(bmr * multiplier)
}

// Rough MET (Metabolic Equivalent of Task) values for common exercises
export const DEFAULT_METS = {
  running: 9.8,
  walking: 3.5,
  cycling: 7.5,
  swimming: 8.0,
  weightlifting: 5.0, // general strength training
  yoga: 3.0,
  hiit: 8.5
}

// Calories burned = METs x (Weight in kg) x (Duration in hours)
export const calculateBurnByMET = (met, weightKg, durationMinutes) => {
  if (!weightKg) weightKg = 70 // default weight
  const durationHours = durationMinutes / 60
  return Math.round(met * weightKg * durationHours)
}
