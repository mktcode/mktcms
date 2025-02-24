import { z } from "zod";

const paramsSchema = z.object({
  slug: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { slug } = await getValidatedRouterParams(event, paramsSchema.parse);

  // direct match
  let page = await db.selectFrom('pages')
    .select(['id', 'title', 'route'])
    .where('route', '=', slug)
    .limit(1)
    .executeTakeFirst()

  // replace last part with ?
  if (!page) {
    const parts = slug.split('/')
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
