import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getGeminiClient } from '../utils/geminiClient.js'
import { queueAiCall } from '../utils/aiRateLimiter.js'

const router = Router()
router.use(requireAuth)

const MODEL = 'gemini-3.6-flash'

async function generateJson(contents) {
  const ai = getGeminiClient()
  if (!ai) return null
  const response = await queueAiCall(() => ai.models.generateContent({
    model: MODEL,
    contents,
    config: { responseMimeType: 'application/json' },
  }))
  return JSON.parse(response.text)
}

router.post('/estimate-workout-impact', asyncHandler(async (req, res) => {
  const { workoutData, userMetrics } = req.body

  const prompt = `
  You are an expert fitness AI. I just completed a workout.
  User Profile:
  - Age: ${userMetrics?.age || 'Unknown'}
  - Gender: ${userMetrics?.gender || 'Unknown'}
  - Weight: ${userMetrics?.weight_kg || 70} kg
  - Activity Level: ${userMetrics?.activity_level || 'Moderate'}

  Workout Log:
  - Duration: ${workoutData?.duration_minutes} minutes
  - Sets logged: ${JSON.stringify(workoutData?.sets)}

  Analyze this workout and return a JSON object with strictly these keys:
  {
    "estimated_calories": number,
    "intensity_score": number (1-10 scale),
    "muscle_fatigue": ["list", "of", "muscles"],
    "recovery_advice": "1 sentence advice"
  }
  Do not return markdown, just valid JSON.
  `

  try {
    res.json(await generateJson(prompt))
  } catch (err) {
    console.error('AI Estimation Error:', err)
    res.json(null)
  }
}))

router.post('/parse-meal-log', asyncHandler(async (req, res) => {
  const { text, customFoods = [] } = req.body

  const foodContext = customFoods.length > 0
    ? `You can match against these custom foods the user has created: ${JSON.stringify(customFoods.map(f => ({ name: f.name, cals: f.calories, p: f.protein_g, c: f.carbs_g, f: f.fat_g })))}`
    : ''

  const prompt = `
  You are an expert nutrition AI. The user just ate something.
  User Input: "${text}"

  ${foodContext}

  Parse this input and return a JSON array of foods they ate. Estimate macros if not matching a custom food.
  Strict JSON format:
  [
    {
      "food_name": "string",
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "sugar_g": number,
      "fat_g": number,
      "cholesterol_mg": number
    }
  ]
  Do not return markdown, just valid JSON array.
  `

  try {
    res.json(await generateJson(prompt))
  } catch (err) {
    console.error('AI Nutrition Parsing Error:', err)
    res.json(null)
  }
}))

router.post('/parse-omni-log', asyncHandler(async (req, res) => {
  const { text } = req.body

  const prompt = `
  You are an expert personal life assistant. The user just typed a free-form message.
  User Input: "${text}"

  Parse this input and extract any relevant data for these 3 categories:
  1. Expense: Did they spend money? (extract amount, category from: food, transport, entertainment, bills, health, shopping, other, and a short note)
  2. Meal: Did they eat something? (extract food_name, calories, protein_g, carbs_g, sugar_g, fat_g, cholesterol_mg)
  3. Workout: Did they exercise? (extract type from: cardio, strength, yoga, sports, other, and duration_minutes)

  Return a JSON object. If a category wasn't mentioned, leave it null.
  Strict JSON format:
  {
    "expense": { "amount": number, "category": "string", "note": "string" } | null,
    "meals": [ { "food_name": "string", "calories": number, "protein_g": number, "carbs_g": number, "sugar_g": number, "fat_g": number, "cholesterol_mg": number } ] | [],
    "workout": { "type": "string", "duration_minutes": number, "notes": "string" } | null
  }
  Do not return markdown, just valid JSON.
  `

  try {
    res.json(await generateJson(prompt))
  } catch (err) {
    console.error('AI Omni Parsing Error:', err)
    res.json(null)
  }
}))

router.post('/scan-nutrition-label', asyncHandler(async (req, res) => {
  const { image, mimeType } = req.body
  if (!image || !mimeType) {
    return res.status(400).json({ error: 'image and mimeType are required' })
  }

  const prompt = `
  You are reading a nutrition facts label from a photo. Extract the values EXACTLY as printed —
  do not estimate or guess anything that isn't legible; use null for anything you can't read clearly.

  Find the serving size (as a number + unit, e.g. 100 + "g", or 1 + "serving" if only a count is given —
  valid units are exactly: "g", "ml", "oz", "serving") and, for that same serving size, the calories,
  protein, total carbohydrates, sugars, total fat, and cholesterol.

  Strict JSON format, no markdown:
  {
    "name": "string | null (product name if visible on the label/packaging, else null)",
    "base_amount": number | null,
    "base_unit": "g" | "ml" | "oz" | "serving" | null,
    "calories": number | null,
    "protein_g": number | null,
    "carbs_g": number | null,
    "sugar_g": number | null,
    "fat_g": number | null,
    "cholesterol_mg": number | null
  }
  `

  const contents = [
    { text: prompt },
    { inlineData: { mimeType, data: image } },
  ]

  try {
    res.json(await generateJson(contents))
  } catch (err) {
    console.error('AI Label Scan Error:', err)
    res.status(err.message?.includes('busy') ? 429 : 500).json({ error: err.message || 'Failed to scan label' })
  }
}))

export default router
