import { defineEventHandler } from 'h3'
import { createAdminChatSession } from '../../../utils/adminChatSessions'

export default defineEventHandler(async () => {
  return await createAdminChatSession()
})
