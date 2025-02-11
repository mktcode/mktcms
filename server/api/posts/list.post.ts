import { z } from "zod";
import { Post } from "~/types";

const bodySchema = z.object({
  category: z.string().default('all'),
  limit: z.number().default(999)
}).default({
  category: 'all',
  limit: 999
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { category, limit } = await readValidatedBody(event, body => bodySchema.parse(body))

  const [posts] = await db.query<Post[]>(`
    SELECT id, category, title, description, date, url 
    FROM content 
    ${category !== 'all' ? `WHERE category = ?` : ''} 
    ORDER BY date DESC 
    ${limit ? `LIMIT ${limit}` : ''}`,
    category !== 'all' ? [category] : []
  );
  
  
  return posts.map((post) => {
    return {
      ...post,
      image: `/img/event${Math.floor(Math.random() * 2) + 1}.jpg`
    }
  })
})
