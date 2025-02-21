export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const query = db
    .selectFrom('pages')
    .select([
      'id',
      'title',
      'slug',
      'type',
    ])
    .orderBy('id', 'asc')

  const pages = await query.execute()
  
  return pages
})
