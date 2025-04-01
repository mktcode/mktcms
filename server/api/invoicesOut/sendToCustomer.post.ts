import { z } from "zod"

export const bodySchema = z.object({
  id: z.number(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageInvoiceOut, id)) {
    return createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, diese Rechnung zu senden.'
    })
  }

  const invoice = await db
    .selectFrom('invoicesOut')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!invoice) {
    return createError({
      status: 404,
      statusMessage: 'Rechnung nicht gefunden.'
    })
  }

  // TODO: Send the invoice to the customer via user email

  return { success: true, error: null }
})
