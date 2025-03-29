import { domainFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const domain = await readValidatedBody(event, body => domainFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (domain.id) {
    if (await denies(event, manageDomain, domain.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diese Domain zu bearbeiten.',
      })
    }

    await db.updateTable('domains').set(domain).where('id', '=', domain.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('domains').values({ ...domain, userId: user.id }).execute()
})
