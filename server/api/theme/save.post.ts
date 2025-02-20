import { z } from "zod";

const bodySchema = z.object({
  primaryColor: z.string(),
  primaryColorHover: z.string(),
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
  const { primaryColor, primaryColorHover } = await readValidatedBody(event, body => bodySchema.parse(body))

  const existngTheme = await db.selectFrom('theme').select(['id']).limit(1).execute()
  if (existngTheme.length > 0) {
    await db.updateTable('theme').set({ primaryColor, primaryColorHover }).where('id', '=', Number(existngTheme[0].id)).execute()
    return { success: true }
  }
  
  await db.insertInto('theme').values({ primaryColor, primaryColorHover }).returning('id').execute()

  return { success: true }
})
