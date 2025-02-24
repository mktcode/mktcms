import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
  contentId: z.number().nullable().optional(),
  categoryId: z.number().nullable().optional(),
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
  const { id, contentId, categoryId } = await readValidatedBody(event, body => bodySchema.parse(body))

  if (categoryId) {
    await db.updateTable('sections').set({ categoryId }).where('id', '=', id).execute()
  } else if (contentId) {
    await db.updateTable('sections').set({ contentId }).where('id', '=', id).execute()
  }

  return { success: true }
})
