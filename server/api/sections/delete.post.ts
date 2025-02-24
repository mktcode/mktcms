import { z } from "zod";

const bodySchema = z.object({
  id: z.number()
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
  const { id } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.deleteFrom('sections').where('id', '=', id).execute()

  return { success: true }
})
