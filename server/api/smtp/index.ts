export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  return await db.selectFrom('smtp').selectAll().where('userId', '=', user.id).executeTakeFirst()
})
