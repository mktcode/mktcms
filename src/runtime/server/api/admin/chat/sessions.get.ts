import { defineEventHandler } from 'h3'
import { listAdminChatSessions } from '../../../utils/adminChatSessions'

export default defineEventHandler(async () => {
  return {
    sessions: await listAdminChatSessions(),
  }
})
