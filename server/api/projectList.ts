export default defineEventHandler(async (event) => {
  const  { user } = await getUserSession(event)

  if (!user) {
    return []
  }

  const db = await getDatabaseConnection()
  const projects = await db.selectFrom('projects').selectAll().where('googleManagerId', '=', user.googleId).execute();

  return projects
})
