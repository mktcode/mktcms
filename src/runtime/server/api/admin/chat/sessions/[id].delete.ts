import { createError, defineEventHandler } from 'h3'
import { deleteAdminChatSession } from '../../../../utils/adminChatSessions'
import { adminChatSessionIdSchema } from '../../../../utils/adminChatShared'

export default defineEventHandler(async (event) => {
  const sessionId = adminChatSessionIdSchema.safeParse(event.context.params?.id)

  if (!sessionId.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid chat session id',
    })
  }

  await deleteAdminChatSession(sessionId.data)
  return { ok: true }
})
