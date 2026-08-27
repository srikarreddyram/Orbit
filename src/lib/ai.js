import { GoogleGenAI } from '@google/genai'

// Initialize dynamically since key comes from Vite env
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return null
  return new GoogleGenAI({ apiKey })
}

/**
 * Generate a highly personalized calorie and fatigue estimate for a workout.
 */
export async function estimateWorkoutImpact(workoutData, userMetrics) {
  const ai = getAIClient()
  if (!ai) return null

  const prompt = `
  You are an expert fitness AI. I just completed a workout.
  User Profile:
  - Age: ${userMetrics?.age || 'Unknown'}
  - Gender: ${userMetrics?.gender || 'Unknown'}
  - Weight: ${userMetrics?.weight_kg || 70} kg
  - Activity Level: ${userMetrics?.activity_level || 'Moderate'}

  Workout Log:
  - Duration: ${workoutData.duration_minutes} minutes
  - Sets logged: ${JSON.stringify(workoutData.sets)}

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    })
    
    return JSON.parse(response.text)
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
  const ai = getAIClient()
  if (!ai) return null

  // Provide custom foods as context so AI can match against them
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    })
    
    return JSON.parse(response.text)
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
  const ai = getAIClient()
  if (!ai) return null

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    })
    
    return JSON.parse(response.text)
  } catch (err) {
    console.error('AI Omni Parsing Error:', err)
    return null
  }
}
