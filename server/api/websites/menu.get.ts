import { z } from "zod";

const paramsSchema = z.object({
  userId: z.string(),
})

export default defineEventHandler(async (event) => {
  const { userId } = await getValidatedQuery(event, paramsSchema.parse);
  const db = await getDatabaseConnection()

  const websites = await db
    .selectFrom('websites')
    .select(['id', 'title', 'path'])
    .where('userId', '=', Number(userId))
    .limit(10)
    .execute()
  
  return websites
})
