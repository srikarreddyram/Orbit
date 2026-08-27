import { GoogleGenAI } from '@google/genai'

let client = null

export function getGeminiClient() {
  if (client) return client
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  client = new GoogleGenAI({ apiKey })
  return client
}
