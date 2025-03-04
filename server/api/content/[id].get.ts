import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const content = await db.selectFrom('contents')
    .selectAll()
    .where('id', '=', Number(id))
    .limit(1)
    .executeTakeFirst()
  
  return content
})
