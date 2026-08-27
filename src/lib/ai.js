import { api } from './api'

/**
 * Generate a highly personalized calorie and fatigue estimate for a workout.
 */
export async function estimateWorkoutImpact(workoutData, userMetrics) {
  try {
    return await api.post('/ai/estimate-workout-impact', { workoutData, userMetrics })
  } catch (err) {
    console.error('AI Estimation Error:', err)
    return null
  }
}

/**
 * Parse natural language food entry into a structured meal object.
 * e.g., "I ate two scrambled eggs and a banana"
 */
export async function parseMealLog(text, customFoods = []) {
  try {
    return await api.post('/ai/parse-meal-log', { text, customFoods })
  } catch (err) {
    console.error('AI Nutrition Parsing Error:', err)
    return null
  }
}

/**
 * Omni-Parser: Takes arbitrary natural language and figures out what to log across all modules.
 * e.g., "I spent $15 on lunch, I'm feeling exhausted, and I did a 20 min run."
 */
export async function parseOmniLog(text) {
  try {
    return await api.post('/ai/parse-omni-log', { text })
  } catch (err) {
    console.error('AI Omni Parsing Error:', err)
    return null
  }
}

/**
 * Read a photographed nutrition facts label and extract its values, scoped
 * to whatever serving size is printed on it. Values the AI can't read
 * clearly come back null rather than guessed — the caller should treat this
 * as a draft to review, not a confirmed log entry.
 */
export async function scanNutritionLabel(imageFile) {
  const { base64, mimeType } = await fileToBase64(imageFile)
  return api.post('/ai/scan-nutrition-label', { image: base64, mimeType })
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // reader.result is "data:<mimeType>;base64,<data>" — Gemini wants just the data
      const [, base64] = reader.result.split(',')
      resolve({ base64, mimeType: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
