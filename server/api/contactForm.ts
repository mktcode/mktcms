import { contactFormMessageSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const contactForm = await readValidatedBody(event, body => contactFormMessageSchema.parse(body))
  const db = await getDatabaseConnection()

  // TODO: CSRF protection
  
  await db.insertInto('contactFormMessages').values({ ...contactForm }).execute()

  return { success: true, error: null }
})
