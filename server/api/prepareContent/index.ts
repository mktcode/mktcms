export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  return await db.selectFrom('prepareContent').selectAll().where('userId', '=', user.id).executeTakeFirst()
})
