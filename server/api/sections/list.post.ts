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
      'orderIndex',
    ])
    .orderBy('orderIndex', 'asc')

  const sections = await query.execute()
  
  return sections
})
