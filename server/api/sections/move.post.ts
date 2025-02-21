import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
  direction: z.enum(['up', 'down'])
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  if (await denies(event, manageWebsite)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }
  
  const { id, direction } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  const section = await db
    .selectFrom('sections')
    .select('orderIndex')
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
  
  const otherSection = await db
    .selectFrom('sections')
    .select(['id', 'orderIndex'])
    .where('orderIndex', direction === 'up' ? '<' : '>', section.orderIndex)
    .orderBy('orderIndex', direction === 'up' ? 'desc' : 'asc')
    .executeTakeFirst()
  
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
