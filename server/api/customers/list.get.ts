import { z } from "zod";

const paramsSchema = z.object({
  projectId: z.string(),
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { projectId, limit } = await getValidatedQuery(event, paramsSchema.parse);

  const contents = await db
    .selectFrom('customers')
    .selectAll()
    .where('projectId', '=', Number(projectId))
    .limit(Number(limit) || 999)
    .execute()
  
  return contents
})
