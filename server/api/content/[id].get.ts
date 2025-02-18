import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const content = await db.selectFrom('contents')
    .select(['id', 'title', 'subtitle', 'description', 'date', 'url', 'image'])
    .where('id', '=', Number(id))
    .limit(1)
    .execute()
    .then(posts => {
      if (posts.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Post not found'
        })
      }
      return posts[0]
    })
  
  const categories = await db.selectFrom('categories')
    .select(['id', 'name', 'label'])
    .where('categories.id', 'in', db.selectFrom('contentCategories').select('categoryId').where('contentCategories.contentId', '=', content.id))
    .execute()
  
  return { ...content, categories }
})
