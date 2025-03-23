import { z } from "zod"

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedQuery(event, paramsSchema.parse);

  return await db.selectFrom('companies').selectAll().where('userId', '=', Number(id)).executeTakeFirst()
})
