import { z } from "zod";
import { Post } from "~/types";

const bodySchema = z.object({
  limit: z.number().default(999)
}).default({ limit: 999 })

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { limit } = await readValidatedBody(event, body => bodySchema.parse(body))

  const [posts] = await db.query<Post[]>(`SELECT id, title, description, date, url FROM content ORDER BY date DESC ${limit ? `LIMIT ${limit}` : ''}`)
  
  return posts.map((post) => {
    return {
      ...post,
      image: `/img/event${Math.floor(Math.random() * 2) + 1}.jpg`
    }
  })
})
