import { createError, defineEventHandler, readValidatedBody } from 'h3'
import { promptAdminChatSession } from '../../utils/adminChat'
import { adminChatPromptRequestSchema } from '../../utils/adminChatShared'

export default defineEventHandler(async (event) => {
  const { sessionId, prompt } = await readValidatedBody(event, body => adminChatPromptRequestSchema.parse(body))

  try {
    return await promptAdminChatSession(sessionId, prompt)
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
