import { createError, defineEventHandler, readValidatedBody } from 'h3'
import { runAdminChat } from '../../utils/adminChat'
import { adminChatRequestSchema } from '../../utils/adminChatShared'

export default defineEventHandler(async (event) => {
  const { messages } = await readValidatedBody(event, body => adminChatRequestSchema.parse(body))

  try {
    return await runAdminChat(messages)
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Admin chat failed', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Admin chat request failed',
    })
  }
})
