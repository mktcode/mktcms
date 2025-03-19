import { invoiceOutFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const { id, customerId, date, status, discount, items } = await readValidatedBody(event, body => invoiceOutFormSchema.parse(body))
    const db = await getDatabaseConnection()

    if (id) {
      if (await denies(event, manageInvoiceOut, id)) {
        return createError({
          status: 403,
          statusMessage: 'You are not authorized to update this invoice.'
        })
      }

      await db.updateTable('invoicesOut').set({ customerId, date }).where('id', '=', id).execute()

      return { success: true, error: null }
    }

    if (await denies(event, manageCustomer, customerId)) {
      return createError({
        status: 403,
        statusMessage: 'You are not authorized to update this content.'
      })
    }
    
    const query = db.insertInto('invoicesOut').values({ customerId, date, status, discount })

    await query.execute()

    return { success: true, error: null }
  } catch (error) {
    return createError({
      status: 400,
      statusMessage: 'Invalid request:' + error,
    })
  }
})
