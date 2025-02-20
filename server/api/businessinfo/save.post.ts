import { z } from "zod";

const bodySchema = z.object({
  name: z.string(),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  taxId: z.string(),
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
  const { name, street, city, zip, phone, email, taxId } = await readValidatedBody(event, body => bodySchema.parse(body))

  const existngBusinessInfo = await db.selectFrom('businessinfo').select(['id']).limit(1).execute()
  if (existngBusinessInfo.length > 0) {
    await db.updateTable('businessinfo').set({ name, street, city, zip, phone, email, taxId }).where('id', '=', Number(existngBusinessInfo[0].id)).execute()
    return { success: true }
  }
  
  await db.insertInto('businessinfo').values({ name, street, city, zip, phone, email, taxId }).returning('id').execute()

  return { success: true }
})
