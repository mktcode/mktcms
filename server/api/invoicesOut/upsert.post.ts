import { invoiceOutFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const invoice = await readValidatedBody(event, body => invoiceOutFormSchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageCustomer, invoice.customerId)) {
    return createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, Rechnungen für diesen Kunden zu verwalten.'
    })
  }

  if (invoice.id) {
    if (await denies(event, manageInvoiceOut, invoice.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diese Rechnung zu bearbeiten.'
      })
    }

    await db.updateTable('invoicesOut').set({
      customerId: invoice.customerId,
      date: invoice.date.split('T')[0],
      discount: invoice.discount,
      status: invoice.status,
    }).where('id', '=', invoice.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('invoicesOut').values({
    customerId: invoice.customerId,
    date: invoice.date,
    discount: invoice.discount,
    status: invoice.status,
  }).execute()
})
