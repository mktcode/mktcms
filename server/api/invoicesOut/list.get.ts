import { z } from "zod";

const paramsSchema = z.object({
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { limit } = await getValidatedQuery(event, paramsSchema.parse);
  const { user } = await requireUserSession(event)

  const invoices = await db
    .selectFrom('invoicesOut')
    .innerJoin('customers', 'customers.id', 'invoicesOut.customerId')
    .select(['invoicesOut.id', 'invoicesOut.customerId', 'customers.name as customerName', 'invoicesOut.date'])
    .where('customers.userId', '=', user.id)
    .limit(limit ? Number(limit) : 9999999)
    .execute()
  
  return invoices
})
