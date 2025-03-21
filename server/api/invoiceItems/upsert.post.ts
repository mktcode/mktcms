import { invoiceItemFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const invoiceItem = await readValidatedBody(event, body => invoiceItemFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (invoiceItem.id) {
    if (await denies(event, manageInvoiceItem, invoiceItem.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diesen Artikel zu bearbeiten',
      })
    }

    await db.updateTable('invoiceItems').set(invoiceItem).where('id', '=', invoiceItem.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('invoiceItems').values({ ...invoiceItem, userId: user.id }).execute()
})
