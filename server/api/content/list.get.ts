import { z } from "zod";

const paramsSchema = z.object({
  projectId: z.string(),
  parentId: z.string().optional(),
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const { projectId, parentId, limit } = await getValidatedQuery(event, paramsSchema.parse);

  let query = db
    .selectFrom('contents')
    .selectAll()
    .where('projectId', '=', Number(projectId))
  
  if (parentId) {
    query = query.where('parentId', '=', Number(parentId))
  } else {
    query = query.where('parentId', 'is', null)
  }

  const contents = await query
    .orderBy('orderIndex', 'asc')
    .orderBy('date', 'desc')
    .limit(Number(limit) || 999)
    .execute()
  
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })
  
  return contents
})
