export type MessageAggregated = {
  id: number
  websiteTitle: string
  contactFormSubject: string
  firstname: string
  lastname: string
  phone: string
  email: string
  message: string
  date: string
}

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  const messages = await db
    .selectFrom('contactFormMessages')
    .innerJoin('websites', 'websites.id', 'contactFormMessages.websiteId')
    .select([
      'websites.title as websiteTitle',
      'websites.contactFormSubject',
      'contactFormMessages.id',
      'contactFormMessages.firstname',
      'contactFormMessages.lastname',
      'contactFormMessages.phone',
      'contactFormMessages.email',
      'contactFormMessages.message',
      'contactFormMessages.date',
    ])
    .where('websites.userId', '=', user.id)
    .execute()

  return messages
})
