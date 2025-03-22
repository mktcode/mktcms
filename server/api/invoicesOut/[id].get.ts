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
        'invoiceItemRelations.quantity',
        'invoiceItemRelations.price'
      ])
      .where('invoiceItemRelations.invoiceId', '=', invoice.id)
      .execute()
    
    const result = {
      ...invoice,
      items
    }

    return result
  }
  
  return null
})
