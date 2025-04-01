import { z } from "zod";
import { invoiceItemRelationFormSchema, invoiceOutFormSchema } from "~/types";

const nestedFormSchema = invoiceOutFormSchema.extend({
  items: z.array(invoiceItemRelationFormSchema)
})

export default defineEventHandler(async (event) => {
  const invoice = await readValidatedBody(event, body => nestedFormSchema.parse(body))
  const db = await getDatabaseConnection()

  if (await denies(event, manageCustomer, invoice.customerId)) {
    throw createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, Rechnungen für diesen Kunden zu verwalten.'
    })
  }

  if (invoice.id) {
    if (await denies(event, manageInvoiceOut, invoice.id)) {
      throw createError({
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

    await db.deleteFrom('invoiceItemRelations').where('invoiceId', '=', invoice.id).execute()
    for (const item of invoice.items) {
      await db.insertInto('invoiceItemRelations').values({
        invoiceId: invoice.id,
        itemId: item.itemId,
        date: item.date.split('T')[0],
        quantity: item.quantity,
        price: item.price,
      }).execute()
    }

    return { success: true, error: null }
  }

  const now = new Date()
  const invoiceNumber = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`

  await db.transaction().execute(async (trx) => {
    const insertResult = await trx.insertInto('invoicesOut').values({
      customerId: invoice.customerId,
      number: invoiceNumber,
      date: invoice.date,
      discount: invoice.discount,
      status: invoice.status,
    }).executeTakeFirstOrThrow()
  
    if (insertResult.insertId) {
      for (const item of invoice.items) {
        await trx.insertInto('invoiceItemRelations').values({
          invoiceId: Number(insertResult.insertId.toString()),
          itemId: item.itemId,
          date: item.date.split('T')[0],
          quantity: item.quantity,
          price: item.price,
        }).execute()
      }
    } else {
      throw createError({
        status: 500,
        statusMessage: 'Fehler beim Erstellen der Rechnung.'
      })
    }
  })
  
  return { success: true, error: null }
})
