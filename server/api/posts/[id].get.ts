import { z } from "zod";
import { Post } from "~/types";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const [posts] = await db.query<Post[]>(`SELECT id, category, title, description, date, url FROM content WHERE id = ? LIMIT 1`, [id])

  if (posts.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }

  const post = posts[0]
  post.image = `/img/event${Math.floor(Math.random() * 2) + 1}.jpg`
  
  return post
})
