import { companyFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const company = await readValidatedBody(event, body => companyFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  const existingCompany = await db.selectFrom('companies').selectAll().where('userId', '=', user.id).executeTakeFirst()

  if (existingCompany) {
    await db.updateTable('companies').set(company).where('userId', '=', user.id).execute()
    return { success: true, error: null }
  } else {
    await db.insertInto('companies').values({ ...company, userId: user.id }).execute()
    return { success: true, error: null }
  }
})
