import { z } from "zod";
import { prepareContentFormSchema } from "~/types";

const inputSchema = z.object({
  prepareContent: prepareContentFormSchema,
  generateWebsite: z.boolean(),
  generateVcard: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const { prepareContent, generateWebsite, generateVcard } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  const existingPrepareContent = await db.selectFrom('prepareContent').selectAll().where('userId', '=', user.id).executeTakeFirst()

  if (existingPrepareContent) {
    await db.updateTable('prepareContent').set(prepareContent).where('userId', '=', user.id).execute()
  } else {
    await db.insertInto('prepareContent').values({ ...prepareContent, userId: user.id }).execute()
  }

  if (prepareContent.slogan) {
    const existingCompany = await db.selectFrom('companies').selectAll().where('userId', '=', user.id).executeTakeFirst()
    if (existingCompany) {
      await db.updateTable('companies').set({ slogan: prepareContent.slogan }).where('userId', '=', user.id).execute()
    }
  }

  let newWebsiteId = null
  let newVcardId = null

  if (generateWebsite) {
    newWebsiteId = await generateWebsiteFromUserInfo({
      userId: user.id,
      ...prepareContent
    })
  }

  return { success: true, error: null, newWebsiteId, newVcardId }
})
