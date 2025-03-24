import { z } from "zod";

const inputSchema = z.object({
  limit: z.string().optional(),
})

const outputSchema = z.array(
  z.object({
    id: z.number(),
    supplierId: z.number(),
    supplierName: z.string(),
    date: z.string(),
    status: z.number(),
    amount: z.number(),
    vat: z.number(),
  })
)
export type Output = z.infer<typeof outputSchema>
export type OutputItem = z.infer<typeof outputSchema>[0]

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { limit } = await getValidatedQuery(event, inputSchema.parse);
  const { user } = await requireUserSession(event)

  const invoices = await db
    .selectFrom('invoicesIn')
    .innerJoin('suppliers', 'suppliers.id', 'invoicesIn.supplierId')
    .select([
      'invoicesIn.id',
      'invoicesIn.supplierId',
      'suppliers.name as supplierName',
      'invoicesIn.date',
      'invoicesIn.status',
      'invoicesIn.amount',
      'invoicesIn.vat',
    ])
    .where('suppliers.userId', '=', user.id)
    .limit(limit ? Number(limit) : 9999999)
    .execute()
  
  const formattedInvoices = invoices.map((invoice) => ({
    ...invoice,
    date: invoice.date.toISOString(),
  }))

  outputSchema.parse(formattedInvoices)
  
  return formattedInvoices
})
