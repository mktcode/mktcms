import db from '~~/db'
import { categoryTable } from '~~/db/schema'

export default defineEventHandler(async () => {
  const categories = await db.select().from(categoryTable)
  return categories
})
