import { describe, expect, it } from 'vitest'
import { guessAgentFromMessage, parseRoutingDecision } from '../../../../../src/runtime/server/utils/adminChatShared'

describe('adminChat', () => {
  describe('guessAgentFromMessage', () => {
    it('routes technical prompts to the coding agent', () => {
      expect(guessAgentFromMessage('Can you debug this Nuxt API endpoint and explain the 401 error?')).toBe('coding')
      expect(guessAgentFromMessage('```ts\nexport default defineEventHandler(() => {})\n```')).toBe('coding')
    })

    it('routes editorial prompts to the conversation agent', () => {
      expect(guessAgentFromMessage('Schreib mir einen freundlichen Intro-Text fuer die Startseite.')).toBe('conversation')
    })
  })

  describe('parseRoutingDecision', () => {
    it('parses valid router output even when wrapped in markdown fences', () => {
      const decision = parseRoutingDecision('```json\n{"agent":"coding","reason":"Technical question"}\n```', 'fallback')

      expect(decision).toEqual({
        agent: 'coding',
        reason: 'Technical question',
      })
    })

    it('falls back to heuristic routing when the model response is invalid', () => {
      const decision = parseRoutingDecision('not json', 'Please review this TypeScript function')

      expect(decision).toEqual({
        agent: 'coding',
        reason: 'Fallback routing',
      })
    })
  })
})
