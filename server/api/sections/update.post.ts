import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
  contentId: z.number(),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  if (await denies(event, manageWebsite)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }
  
  const db = await getDatabaseConnection()
  const { id, contentId } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.updateTable('sections').set({ contentId }).where('id', '=', id).execute()
})
