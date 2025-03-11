import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const customer = await db.selectFrom('customers')
    .selectAll()
    .where('id', '=', Number(id))
    .limit(1)
    .executeTakeFirst()
  
  return customer
})
