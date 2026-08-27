export function errorHandler(err, req, res, _next) {
  console.error(err)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Already exists' })
  }
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
}
