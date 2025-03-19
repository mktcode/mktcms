import { z } from "zod";

const paramsSchema = z.object({
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { limit } = await getValidatedQuery(event, paramsSchema.parse);
  const { user } = await requireUserSession(event)

  const invoices = await db
    .selectFrom('invoicesIn')
    .innerJoin('suppliers', 'suppliers.id', 'invoicesIn.supplierId')
    .select(['invoicesIn.id', 'invoicesIn.supplierId', 'suppliers.name as supplierName', 'invoicesIn.date'])
    .where('suppliers.userId', '=', user.id)
    .limit(limit ? Number(limit) : 9999999)
    .execute()
  
  return invoices
})
