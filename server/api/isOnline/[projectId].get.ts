import { z } from "zod";

const paramsSchema = z.object({
  projectId: z.string()
})

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  const { projectId } = await getValidatedRouterParams(event, paramsSchema.parse);

  const db = await getDatabaseConnection()
  const project = await db.selectFrom('projects')
    .select(['isOnline'])
    .where('id', '=', Number(projectId))
    .limit(1)
    .executeTakeFirst()

  if (!project) {
    return false
  }

  return project.isOnline
})
