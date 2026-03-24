import z from 'zod'

export const adminChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
})

export const adminChatRequestSchema = z.object({
  messages: z.array(adminChatMessageSchema).min(1).max(30),
})

const routingDecisionSchema = z.object({
  agent: z.enum(['conversation', 'coding']),
  reason: z.string().trim().min(1).max(280).optional(),
})

export type AdminChatMessage = z.infer<typeof adminChatMessageSchema>
export type AdminChatAgent = z.infer<typeof routingDecisionSchema>['agent']

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
