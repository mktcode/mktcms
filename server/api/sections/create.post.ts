import { z } from "zod";

const bodySchema = z.object({
  name: z.string(),
  component: z.string(),
  route: z.string().nullable(),
  categoryId: z.number().nullable(),
  isDetailsPage: z.boolean(),
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
  const { name, component, route, categoryId, isDetailsPage } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db.insertInto('sections').values({
    name,
    component,
    route,
    categoryId,
    isDetailsPage: Number(isDetailsPage),
    orderIndex: 0,
  }).execute()

  return { success: true }
})
