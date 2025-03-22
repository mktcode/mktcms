import { z } from "zod"

export const bodySchema = z.object({
  id: z.number(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageWebsite, id)) {
    throw createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, diese Website zu kopieren.'
    })
  }

  const website = await db.selectFrom('websites').selectAll().where('id', '=', id).executeTakeFirstOrThrow()
  const websiteContents = await db.selectFrom('websiteContents').selectAll().where('websiteId', '=', id).execute()

  const newWebsiteInsertResult = await db.insertInto('websites').values({
    ...website,
    id: undefined,
    path: website.path + '-kopie',
    title: website.title + ' (Kopie)',
    isOnline: false,
  }).executeTakeFirstOrThrow()

  if (!newWebsiteInsertResult.insertId) {
    return { success: false, error: 'Failed to create new website', newWebsiteId: null }
  }

  const newWebsiteId = Number(newWebsiteInsertResult.insertId.toString())

  for (const content of websiteContents) {
    await db.insertInto('websiteContents').values({
      ...content,
      id: undefined,
      websiteId: newWebsiteId,
    }).execute()
  }

  return { success: true, error: null, newWebsiteId }
})
