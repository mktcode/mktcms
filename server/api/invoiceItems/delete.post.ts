import { z } from "zod"

export const bodySchema = z.object({
  id: z.number(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageInvoiceItem, id)) {
    return createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, diesen Artikel zu löschen',
    })
  }

  await db.deleteFrom('invoiceItems').where('id', '=', id).execute()

  return { success: true, error: null }
})
