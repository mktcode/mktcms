import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
  direction: z.enum(['up', 'down']),
  route: z.string().nullable(),
  categoryId: z.number().nullable(),
  isDetailsPage: z.boolean().nullable(),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  if (await denies(event, manageWebsite)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }
  
  const { id, direction, route, categoryId, isDetailsPage } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  const section = await db
    .selectFrom('sections')
    .select('orderIndex')
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
  
  let otherSectionQuery = db
    .selectFrom('sections')
    .select(['id', 'orderIndex'])
  
    if (route === null) {
      otherSectionQuery = otherSectionQuery.where('route', 'is', null)
    } else {
      otherSectionQuery = otherSectionQuery.where('route', '=', route)
    }
  
    if (categoryId === null) {
      otherSectionQuery = otherSectionQuery.where('categoryId', 'is', null)
    } else {
      otherSectionQuery = otherSectionQuery.where('categoryId', '=', categoryId)
    }
  
  otherSectionQuery = otherSectionQuery
    .where('isDetailsPage', '=', Number(isDetailsPage))
    .where('orderIndex', direction === 'up' ? '<' : '>', section.orderIndex)
    .orderBy('orderIndex', direction === 'up' ? 'desc' : 'asc')
  
  const otherSection = await otherSectionQuery.executeTakeFirst()
  
  if (!otherSection) {
    return { success: true }
  }

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('sections')
      .set('orderIndex', otherSection.orderIndex)
      .where('id', '=', id)
      .execute()

    await trx
      .updateTable('sections')
      .set('orderIndex', section.orderIndex)
      .where('id', '=', otherSection.id)
      .execute()
  })
})
