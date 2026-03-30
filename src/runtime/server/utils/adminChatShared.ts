import z from 'zod'

export const adminChatSessionIdSchema = z.uuid()

export const adminChatPromptSchema = z.string().trim().min(1).max(4000)

export const adminChatPromptRequestSchema = z.object({
  sessionId: adminChatSessionIdSchema,
  prompt: adminChatPromptSchema,
})

const routingDecisionSchema = z.object({
  agent: z.enum(['conversation', 'coding']),
  reason: z.string().trim().min(1).max(280).optional(),
})

export type AdminChatAgent = z.infer<typeof routingDecisionSchema>['agent']
export type AdminChatMessage = {
  role: 'user' | 'assistant'
  content: string
  agent?: AdminChatAgent
}

export type AdminChatSessionSummary = {
  id: string
  name: string | null
  label: string
  preview: string | null
  createdAt: string
  updatedAt: string
  messageCount: number
}

export type AdminChatSessionDetail = {
  session: AdminChatSessionSummary
  messages: AdminChatMessage[]
}

export type AdminChatPromptResponse = AdminChatSessionDetail & {
  agent: AdminChatAgent
  reason?: string
}

type RoutingDecision = z.infer<typeof routingDecisionSchema>

const codingHints = [
  /```/,
  /\b(api|auth|bug|build|code|commit|component|config|console|css|database|debug|deploy|endpoint|env|error|eslint|git|html|http|javascript|json|lint|migration|npm|nuxt|openai|package|query|react|regex|schema|script|server|sql|stack trace|tailwind|test|token|typescript|vue|yaml)\b/i,
]

function extractJsonObject(value: string) {
  const startIndex = value.indexOf('{')
  const endIndex = value.lastIndexOf('}')

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return value.trim()
  }

  return value.slice(startIndex, endIndex + 1)
}

export function guessAgentFromMessage(message: string): AdminChatAgent {
  return codingHints.some(pattern => pattern.test(message)) ? 'coding' : 'conversation'
}

export function parseRoutingDecision(output: string, fallbackMessage: string): RoutingDecision {
  try {
    return routingDecisionSchema.parse(JSON.parse(extractJsonObject(output)))
  }
  catch {
    return {
      agent: guessAgentFromMessage(fallbackMessage),
      reason: 'Fallback routing',
    }
  }
}
