import { z } from "zod";

const bodySchema = z.object({
  projectId: z.number(),
  parentId: z.number().optional(),
  limit: z.number().default(999)
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { projectId, parentId, limit } = await readValidatedBody(event, body => bodySchema.parse(body))

  let query = db
    .selectFrom('contents')
    .selectAll()
    .where('projectId', '=', projectId)
  
  if (parentId) {
    query = query.where('parentId', '=', parentId)
  } else {
    query = query.where('parentId', 'is', null)
  }

  const contents = await query
    .orderBy('date', 'desc')
    .limit(limit)  
    .execute()
  
  return contents
})
