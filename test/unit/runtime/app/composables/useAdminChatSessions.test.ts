import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('@vueuse/core', () => ({
  useLocalStorage: (_key: string, initialValue: unknown, _options?: unknown) => ref(initialValue),
}))

async function createComposable() {
  const { useAdminChatSessions } = await import('../../../../../src/runtime/app/composables/useAdminChatSessions')

  return useAdminChatSessions()
}

describe('useAdminChatSessions', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads the preferred session on initialize', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        sessions: [{
          id: 'cfab5e87-579d-4876-b7fd-e5d1d2be2c8a',
          name: null,
          label: 'Neue Sitzung',
          preview: 'Noch keine Nachrichten',
          createdAt: '2026-03-30T12:00:00.000Z',
          updatedAt: '2026-03-30T12:00:00.000Z',
          messageCount: 0,
        }],
      })
      .mockResolvedValueOnce({
        session: {
          id: 'cfab5e87-579d-4876-b7fd-e5d1d2be2c8a',
          name: null,
          label: 'Neue Sitzung',
          preview: 'Noch keine Nachrichten',
          createdAt: '2026-03-30T12:00:00.000Z',
          updatedAt: '2026-03-30T12:00:00.000Z',
          messageCount: 0,
        },
        messages: [],
      })

    vi.stubGlobal('$fetch', fetchMock)

    const chat = await createComposable()
    await chat.initialize()

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/chat/sessions')
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/chat/sessions/cfab5e87-579d-4876-b7fd-e5d1d2be2c8a')
    expect(chat.activeSessionId.value).toBe('cfab5e87-579d-4876-b7fd-e5d1d2be2c8a')
    expect(chat.sessions.value).toHaveLength(1)
  })

  it('posts prompts to the active server session and replaces the optimistic transcript', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        sessions: [{
          id: 'cfab5e87-579d-4876-b7fd-e5d1d2be2c8a',
          name: null,
          label: 'Neue Sitzung',
          preview: 'Noch keine Nachrichten',
          createdAt: '2026-03-30T12:00:00.000Z',
          updatedAt: '2026-03-30T12:00:00.000Z',
          messageCount: 0,
        }],
      })
      .mockResolvedValueOnce({
        session: {
          id: 'cfab5e87-579d-4876-b7fd-e5d1d2be2c8a',
          name: null,
          label: 'Neue Sitzung',
          preview: 'Noch keine Nachrichten',
          createdAt: '2026-03-30T12:00:00.000Z',
          updatedAt: '2026-03-30T12:00:00.000Z',
          messageCount: 0,
        },
        messages: [],
      })
      .mockResolvedValueOnce({
        session: {
          id: 'cfab5e87-579d-4876-b7fd-e5d1d2be2c8a',
          name: 'Bitte prüfe den Fehler',
          label: 'Bitte prüfe den Fehler',
          preview: 'Bitte prüfe den Fehler',
          createdAt: '2026-03-30T12:00:00.000Z',
          updatedAt: '2026-03-30T12:01:00.000Z',
          messageCount: 2,
        },
        messages: [
          { role: 'user', content: 'Bitte prüfe den Fehler' },
          { role: 'assistant', content: 'Ich prüfe ihn jetzt.', agent: 'coding' },
        ],
        agent: 'coding',
        reason: 'technical question',
      })

    vi.stubGlobal('$fetch', fetchMock)

    const chat = await createComposable()
    await chat.initialize()
    chat.draft.value = 'Bitte prüfe den Fehler'

    await chat.sendPrompt()

    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/chat', {
      method: 'POST',
      body: {
        sessionId: 'cfab5e87-579d-4876-b7fd-e5d1d2be2c8a',
        prompt: 'Bitte prüfe den Fehler',
      },
    })
    expect(chat.draft.value).toBe('')
    expect(chat.messages.value).toEqual([
      { role: 'user', content: 'Bitte prüfe den Fehler' },
      { role: 'assistant', content: 'Ich prüfe ihn jetzt.', agent: 'coding' },
    ])
    expect(chat.activeSession.value?.label).toBe('Bitte prüfe den Fehler')
  })
})
