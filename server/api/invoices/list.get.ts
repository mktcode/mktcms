import { z } from "zod";

const paramsSchema = z.object({
  projectId: z.string(),
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { projectId, limit } = await getValidatedQuery(event, paramsSchema.parse);

  const invoices = await db
    .selectFrom('invoices')
    .innerJoin('customers', 'customers.id', 'invoices.customerId')
    .select(['invoices.id', 'invoices.customerId', 'invoices.date'])
    .where('customers.projectId', '=', Number(projectId))
    .limit(limit ? Number(limit) : 9999999)
    .execute()
  
  return invoices
})
