import { z } from "zod";

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('id', '=', Number(id))
    .limit(1)
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
