import { sql } from "kysely";
import { z } from "zod";

const inputSchema = z.object({
  limit: z.string().optional(),
})

const outputSchema = z.array(
  z.object({
    id: z.number(),
    customerId: z.number(),
    customerName: z.string(),
    customerEmail: z.string(),
    date: z.string(),
    total: z.number(),
    discount: z.number(),
    status: z.number(),
  })
)
export type Output = z.infer<typeof outputSchema>
export type OutputItem = z.infer<typeof outputSchema>[0]

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { limit } = await getValidatedQuery(event, inputSchema.parse);
  const { user } = await requireUserSession(event)

  const invoices = await db
    .selectFrom('invoicesOut')
    .innerJoin('customers', 'customers.id', 'invoicesOut.customerId')
    .innerJoin('invoiceItemRelations', 'invoiceItemRelations.invoiceId', 'invoicesOut.id')
    .select(({ eb, fn, ref }) => [
      'invoicesOut.id',
      'invoicesOut.customerId',
      'customers.name as customerName',
      'customers.email as customerEmail',
      'invoicesOut.date',
      fn.sum(sql`${ref('invoiceItemRelations.price')} * ${ref('invoiceItemRelations.quantity')}`).as('total'),
      'invoicesOut.discount',
      'invoicesOut.status',
    ])
    .where('customers.userId', '=', user.id)
    .groupBy('invoicesOut.id')
    .limit(limit ? Number(limit) : 9999999)
    .execute()

  const formattedInvoices = invoices.map((invoice) => ({
    ...invoice,
    date: invoice.date.toISOString(),
    total: Number(invoice.total),
    discount: Number(invoice.discount),
  }))

  outputSchema.parse(formattedInvoices)
  
  return formattedInvoices
})
