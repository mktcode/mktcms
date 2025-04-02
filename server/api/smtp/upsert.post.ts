import { smtpFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const smtp = await readValidatedBody(event, body => smtpFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  const existingSmtp = await db.selectFrom('smtp').selectAll().where('userId', '=', user.id).executeTakeFirst()

  if (existingSmtp) {
    await db.updateTable('smtp').set(smtp).where('userId', '=', user.id).execute()
    return { success: true, error: null }
  } else {
    await db.insertInto('smtp').values({ ...smtp, userId: user.id }).execute()
    return { success: true, error: null }
  }
})
