export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const pages = await db
    .selectFrom('pages')
    .select([
      'id',
      'title',
      'route'
    ])
    .execute()
  
  return pages
})
