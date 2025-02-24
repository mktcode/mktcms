import { z } from "zod";

const bodySchema = z.object({
  pageId: z.number(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { pageId } = await readValidatedBody(event, body => bodySchema.parse(body))

  const sections = await db
    .selectFrom('sections')
    .select([
      'id',
      'pageId',
      'categoryId',
      'contentId',
      'component',
      'orderIndex',
    ])
    .where('pageId', '=', pageId)
    .orderBy('orderIndex', 'asc')
    .execute()
  
  return sections
})
