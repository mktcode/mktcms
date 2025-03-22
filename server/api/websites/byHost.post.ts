import { z } from "zod"

export const bodySchema = z.object({
  hostname: z.string(),
  pathname: z.string(),
})

export default defineEventHandler(async (event) => {
  const { hostname, pathname } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = await getDatabaseConnection()

  const website = await db
    .selectFrom('websites')
    .selectAll()
    .where('domain', '=', hostname)
    .where('path', '=', pathname)
    .where('isOnline', '=', true)
    .executeTakeFirst()
  
  if (website) {
    const contents = await db.selectFrom('websiteContents')
      .selectAll()
      .where('websiteId', '=', website.id)
      .execute()
    
    return {
      ...website,
      contents
    }
  }
  
  return null
})
