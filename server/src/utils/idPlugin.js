// Shared schema plugin: exposes Mongo's _id as a plain "id" string and
// strips internal fields so API responses match the shape the frontend
// already expects (it used to talk to Postgres/Supabase directly).
export function idPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id
      delete ret.__v
      return ret
    },
  })
  schema.set('toObject', { virtuals: true })
}
