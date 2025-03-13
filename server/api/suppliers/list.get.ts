import { z } from "zod";

const paramsSchema = z.object({
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { limit } = await getValidatedQuery(event, paramsSchema.parse);
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const suppliers = await db
    .selectFrom('suppliers')
    .selectAll()
    .where('userId', '=', Number(user.id))
    .limit(Number(limit) || 999)
    .execute()
  
  return suppliers
})
