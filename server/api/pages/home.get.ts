export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const page = await db.selectFrom('pages')
    .select(['id', 'title', 'route'])
    .where('route', 'is', null)
    .limit(1)
    .executeTakeFirstOrThrow()
  
  return page
})
