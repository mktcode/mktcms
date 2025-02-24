import { z } from "zod";

const bodySchema = z.object({
  pageId: z.number(),
  component: z.string(),
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
  const { pageId, component } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.insertInto('sections').values({
    pageId,
    component,
    orderIndex: await db
      .selectFrom('sections')
      .select('orderIndex')
      .where('pageId', '=', pageId)
      .orderBy('orderIndex', 'desc')
      .executeTakeFirst()
      .then(section => section ? section.orderIndex + 1 : 0),
  }).execute()

  return { success: true }
})
