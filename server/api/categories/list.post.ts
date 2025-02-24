export default defineEventHandler(async (event) => {
  // TODO: Why is auth missing here?
  // await requireUserSession(event)

  const db = await getDatabaseConnection()

  const query = db
    .selectFrom('categories')
    .select(['id', 'name', 'label'])

  const categories = await query.execute()
  
  return categories
})
