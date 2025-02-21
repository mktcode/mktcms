import { z } from "zod";

const bodySchema = z.object({
  pageSlug: z.string().default(''),
  type: z.enum(['static', 'dynamic']).default('static'),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { pageSlug, type } = await readValidatedBody(event, body => bodySchema.parse(body))

  const page = await db
    .selectFrom('pages')
    .select('id')
    .where('slug', '=', pageSlug)
    .where('type', '=', type)
    .executeTakeFirstOrThrow()

  const query = db
    .selectFrom('sections')
    .select([
      'id',
      'name',
      'component',
      'contentId',
      'categoryId',
      'orderIndex',
    ])
    .where('pageId', '=', page.id)
    .orderBy('orderIndex', 'asc')

  const sections = await query.execute()
  
  return sections
})
