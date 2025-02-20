export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const query = db
    .selectFrom('sections')
    .select([
      'id',
      'name',
      'component',
      'contentId',
      'categoryId',
    ])

  const sections = await query.execute()
  
  return sections
})
