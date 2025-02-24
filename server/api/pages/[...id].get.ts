import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  // direct match
  let page = await db.selectFrom('pages')
    .select(['id', 'title', 'route'])
    .where((eb) => eb.or([
      eb('id', '=', Number(id)),
      eb('route', '=', id)
    ]))
    .limit(1)
    .executeTakeFirst()

  // replace last part with ?
  if (!page) {
    const parts = id.split('/')
    parts[parts.length - 1] = '?'
    const dynamicRoute = parts.join('/')
    
    page = await db.selectFrom('pages')
      .select(['id', 'title', 'route'])
      .where('route', '=', dynamicRoute)
      .limit(1)
      .executeTakeFirstOrThrow()
  }
  
  return page
})
