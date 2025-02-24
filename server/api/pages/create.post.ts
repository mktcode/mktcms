import { z } from "zod";
import slugify from "~/utils/slugify";

const bodySchema = z.object({
  title: z.string(),
  isHome: z.boolean(),
  isDynamic: z.boolean(),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  const db = await getDatabaseConnection()
  const { title, isHome, isDynamic } = await readValidatedBody(event, body => bodySchema.parse(body))

  let route: string | null = slugify(title)
  if (isHome) {
    route = null
  } else if (isDynamic) {
    route = `${route}/?`
  }

  const result = await db.insertInto('pages').values({ title, route }).execute()

  return { success: true }
})
