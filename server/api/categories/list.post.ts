export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = await getDatabaseConnection()

  const query = db
    .selectFrom('categories')
    .select(['id', 'name', 'label'])

  const categories = await query.execute()
  
  return categories
})
