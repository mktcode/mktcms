import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const invoice = await db.selectFrom('invoicesOut')
    .selectAll()
    .where('id', '=', Number(id))
    .limit(1)
    .executeTakeFirst()
  
  if (invoice) {
    const items = await db.selectFrom('invoiceItemRelations')
      .innerJoin('invoiceItems', 'invoiceItems.id', 'invoiceItemRelations.itemId')
      .select([
        'invoiceItems.id',
        'invoiceItems.title',
        'invoiceItems.description',
        'invoiceItems.unit',
        'invoiceItemRelations.itemId',
        'invoiceItemRelations.quantity',
        'invoiceItemRelations.date',
        'invoiceItemRelations.price'
      ])
      .where('invoiceItemRelations.invoiceId', '=', invoice.id)
      .execute()
    
    const result = {
      ...invoice,
      date: invoice.date.toISOString(),
      discount: Number(invoice.discount),
      items: items.map(item => ({
        ...item,
        date: invoice.date.toISOString(),
        price: Number(item.price),
        quantity: Number(item.quantity)
      }))
    }

    return result
  }
  
  return null
})
