import { createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { appendAdminChatTurnMetadata, getAdminChatSessionDetail, maybeNameAdminChatSession, openAdminChatSessionManager } from './adminChatSessions'
import { parseRoutingDecision, type AdminChatMessage, type AdminChatPromptResponse } from './adminChatShared'
import { runPiPrompt } from './piAgentRunner'

type AdminChatRuntimeConfig = ReturnType<typeof useRuntimeConfig> & {
  mktcms: {
    openaiApiKey: string
    openaiModel: string
  }
}

const ROUTER_INSTRUCTIONS = `You are the routing agent for the MktCMS admin chat.

Choose exactly one target agent:
- conversation: content, editorial, planning, UX copy, translations, general discussion, and non-technical admin questions.
- coding: code, bugs, errors, stack traces, APIs, configuration, implementation details, scripts, SQL, CSS, HTML, JavaScript, TypeScript, Vue, Nuxt, Git, tests, and anything that would benefit from a technical answer.

Return JSON only in this exact shape:
{"agent":"conversation"|"coding","reason":"short explanation"}`

const CONVERSATION_INSTRUCTIONS = `You are the conversation agent for the MktCMS admin area.

You help a website admin with content, copy, planning, editorial decisions, workflow questions, and general product discussion.
Be concise, practical, and respond in the same language as the latest admin message.
Do not claim to have inspected files or executed tools.`

const CODING_INSTRUCTIONS = `You are the coding agent for the MktCMS admin area.

You help with technical questions, debugging, and implementation work.
Be precise and practical. Inspect the codebase first, then make the smallest safe change that solves the request.
You have coding tools that can read, search, edit, and write files, but only inside the current project directory.
Never modify anything outside the project directory. Do not use destructive commands unless the user explicitly asks for them.
Preserve existing route contracts, auth behavior, and content-path safety rules when changing this codebase.
Respond in the same language as the latest admin message.`

function buildTranscript(messages: AdminChatMessage[]) {
  return messages
    .map(message => `${message.role === 'user' ? 'Admin' : 'Assistant'}: ${message.content.trim()}`)
    .join('\n\n')
}

export async function promptAdminChatSession(sessionId: string, prompt: string): Promise<AdminChatPromptResponse> {
  const latestUserMessage = prompt.trim()

  if (!latestUserMessage) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt must not be empty',
    })
  }

  const { mktcms: { openaiModel, openaiApiKey } } = useRuntimeConfig() as AdminChatRuntimeConfig
  const detail = await getAdminChatSessionDetail(sessionId)
  const transcript = buildTranscript([...detail.messages, {
    role: 'user',
    content: latestUserMessage,
  }])

  const cwd = process.cwd()
  const provider = 'openai'

  const routingText = await runPiPrompt({
    cwd,
    provider,
    modelId: openaiModel,
    apiKey: openaiApiKey,
    systemPrompt: ROUTER_INSTRUCTIONS,
    prompt: `Conversation transcript:\n\n${transcript}\n\nLatest admin message:\n${latestUserMessage}`,
    tools: 'none',
  })

  const routingDecision = parseRoutingDecision(routingText, latestUserMessage)

  const sessionManager = await openAdminChatSessionManager(sessionId)
  const message = await runPiPrompt({
    cwd,
    provider,
    modelId: openaiModel,
    apiKey: openaiApiKey,
    systemPrompt: routingDecision.agent === 'coding' ? CODING_INSTRUCTIONS : CONVERSATION_INSTRUCTIONS,
    prompt: latestUserMessage,
    tools: routingDecision.agent === 'coding' ? 'coding' : 'none',
    sessionManager,
    onComplete: (session) => {
      appendAdminChatTurnMetadata(session.sessionManager, routingDecision.agent)
      maybeNameAdminChatSession(session.sessionManager, latestUserMessage)
    },
  })

  if (!message.trim()) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Chat model returned an empty response',
    })
  }

  const updatedDetail = await getAdminChatSessionDetail(sessionId)

  return {
    ...updatedDetail,
    agent: routingDecision.agent,
    reason: routingDecision.reason,
  }
}
