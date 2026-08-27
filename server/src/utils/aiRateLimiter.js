// Gemini's free tier caps out around 10-15 requests/minute, shared across
// every user of this app (one server-side API key, not one per user). This
// queues AI calls so concurrent requests from multiple users get spaced out
// instead of bursting past that ceiling all at once.
const MAX_PER_MINUTE = 8
const MIN_SPACING_MS = Math.ceil(60000 / MAX_PER_MINUTE)
const MAX_QUEUE_LENGTH = 20

let lastRunAt = 0
const queue = []
let draining = false

function drain() {
  if (draining) return
  draining = true

  const next = () => {
    const job = queue.shift()
    if (!job) {
      draining = false
      return
    }
    const wait = Math.max(0, lastRunAt + MIN_SPACING_MS - Date.now())
    setTimeout(async () => {
      lastRunAt = Date.now()
      try {
        job.resolve(await job.fn())
      } catch (err) {
        job.reject(err)
      }
      next()
    }, wait)
  }
  next()
}

/**
 * Queue a Gemini call so it's paced against the shared rate limit instead of
 * firing immediately. Rejects fast (no queuing) once the backlog is deep
 * enough that waiting wouldn't give a reasonable response time anymore.
 */
export function queueAiCall(fn) {
  if (queue.length >= MAX_QUEUE_LENGTH) {
    return Promise.reject(new Error('AI is busy right now — try again in a moment.'))
  }
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject })
    drain()
  })
}
