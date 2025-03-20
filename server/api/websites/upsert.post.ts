import { z } from "zod";
import { websiteContentFormSchema, websiteFormSchema } from "~/types";

const nestedFormSchema = websiteFormSchema.extend({
  contents: z.array(websiteContentFormSchema)
})

export default defineEventHandler(async (event) => {
  const website = await readValidatedBody(event, body => nestedFormSchema.parse(body))
  const contents = website.contents
  const websiteWithoutContents = { ...website, contents: undefined }
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (website.id) {
    if (await denies(event, manageWebsite, website.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diese Website zu bearbeiten.'
      })
    }

    await db.updateTable('websites').set(websiteWithoutContents).where('id', '=', website.id).execute()
    await db.deleteFrom('websiteContents').where('websiteId', '=', website.id).execute()
    for (const content of contents) {
      await db.insertInto('websiteContents').values({ ...content, websiteId: website.id }).execute()
    }

    return { success: true, error: null }
  }
  
  const insertResult = await db.insertInto('websites').values({ ...websiteWithoutContents, userId: user.id }).executeTakeFirstOrThrow()
  if (insertResult.insertId) {
    for (const content of contents) {
      await db.insertInto('websiteContents').values({ ...content, websiteId: Number(insertResult.insertId.toString()) }).execute()
    }

    return { success: true, error: null }
  }
})
