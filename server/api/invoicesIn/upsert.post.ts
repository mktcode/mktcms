import { invoiceInFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const invoice = await readValidatedBody(event, body => invoiceInFormSchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageSupplier, invoice.supplierId)) {
    return createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, Rechnungen für diesen Lieferanten zu verwalten.'
    })
  }

  if (invoice.id) {
    if (await denies(event, manageInvoiceIn, invoice.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diese Rechnung zu bearbeiten.'
      })
    }

    await db.updateTable('invoicesIn').set({
      supplierId: invoice.supplierId,
      date: invoice.date.split('T')[0],
      discount: invoice.discount,
      status: invoice.status,
    }).where('id', '=', invoice.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('invoicesIn').values({
    supplierId: invoice.supplierId,
    date: invoice.date,
    discount: invoice.discount,
    status: invoice.status,
  }).execute()
})
