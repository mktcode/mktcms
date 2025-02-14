import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const post = await db.selectFrom('content')
    .select(['id', 'category', 'title', 'description', 'date', 'url', 'image'])
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
  
  return post
})
