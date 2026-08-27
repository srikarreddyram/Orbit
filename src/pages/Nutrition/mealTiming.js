// Infer a sensible default meal type from the current time of day,
// used when the user hasn't explicitly told us which meal they're logging.
export function inferMealType(date = new Date()) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 16) return 'lunch'
  if (hour >= 16 && hour < 21) return 'dinner'
  return 'snack'
}
