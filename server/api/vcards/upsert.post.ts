import { vcardFormSchema } from "~/types";

export default defineEventHandler(async (event) => {
  const vcard = await readValidatedBody(event, body => vcardFormSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  if (vcard.id) {
    if (await denies(event, manageVcard, vcard.id)) {
      return createError({
        status: 403,
        statusMessage: 'Du bist nicht berechtigt, diese Visitenkarte zu bearbeiten.'
      })
    }

    await db.updateTable('vcards').set(vcard).where('id', '=', vcard.id).execute()

    return { success: true, error: null }
  }
  
  await db.insertInto('vcards').values({ ...vcard, userId: user.id }).execute()

  return { success: true, error: null }
})
