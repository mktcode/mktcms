import { createError, defineEventHandler } from 'h3'
import { getAdminChatSessionDetail } from '../../../../utils/adminChatSessions'
import { adminChatSessionIdSchema } from '../../../../utils/adminChatShared'

export default defineEventHandler(async (event) => {
  const sessionId = adminChatSessionIdSchema.safeParse(event.context.params?.id)

  if (!sessionId.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid chat session id',
    })
  }

  return await getAdminChatSessionDetail(sessionId.data)
})
