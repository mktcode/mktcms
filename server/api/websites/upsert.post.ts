import { websiteFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const website = await readValidatedBody(event, body => websiteFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (website.id) {
    if (await denies(event, manageWebsite, website.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diese Website zu bearbeiten.'
      })
    }

    await db.updateTable('websites').set(website).where('id', '=', website.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('websites').values({ ...website, userId: user.id }).execute()
})
