import { computed } from 'vue'
import { useState } from '#app'
import { useLocalStorage } from '@vueuse/core'

export type AdminChatAgent = 'conversation' | 'coding'

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

type AdminChatSessionDetail = {
  session: AdminChatSessionSummary
  messages: AdminChatMessage[]
}

type AdminChatPromptResponse = AdminChatSessionDetail & {
  agent: AdminChatAgent
  reason: string
}

function getErrorMessage(error: any) {
  return error?.data?.statusMessage || error?.message || 'Die Anfrage konnte nicht verarbeitet werden.'
}

function getStatusCode(error: any) {
  return Number(error?.statusCode || error?.response?.status || error?.data?.statusCode)
}

function sortSessions(items: AdminChatSessionSummary[]) {
  return [...items].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )
}

function upsertSession(items: AdminChatSessionSummary[], session: AdminChatSessionSummary) {
  const next = items.filter(item => item.id !== session.id)
  next.push(session)
  return sortSessions(next)
}

export function useAdminChatSessions() {
  const activeSessionId = useLocalStorage<string | null>('mktcms_admin_chat_session_id', null, {
    initOnMounted: true,
  })

  const sessions = useState<AdminChatSessionSummary[]>('mktcms-admin-chat-sessions', () => [])
  const messages = useState<AdminChatMessage[]>('mktcms-admin-chat-messages', () => [])
  const draft = useState('mktcms-admin-chat-draft', () => '')
  const errorMessage = useState('mktcms-admin-chat-error-message', () => '')
  const isSessionsLoading = useState('mktcms-admin-chat-is-sessions-loading', () => false)
  const isTranscriptLoading = useState('mktcms-admin-chat-is-transcript-loading', () => false)
  const isCreatingSession = useState('mktcms-admin-chat-is-creating-session', () => false)
  const isSending = useState('mktcms-admin-chat-is-sending', () => false)
  const hasInitialized = useState('mktcms-admin-chat-has-initialized', () => false)

  const activeSession = computed(() => sessions.value.find(session => session.id === activeSessionId.value) || null)
  const canSend = computed(() => Boolean(activeSessionId.value) && draft.value.trim().length > 0 && !isSending.value)
  const isBusy = computed(() => isSessionsLoading.value || isTranscriptLoading.value || isCreatingSession.value)

  function applySessionDetail(detail: AdminChatSessionDetail) {
    sessions.value = upsertSession(sessions.value, detail.session)
    activeSessionId.value = detail.session.id
    messages.value = detail.messages
  }

  async function loadSessionDetail(sessionId: string) {
    const detail = await $fetch<AdminChatSessionDetail>(`/api/admin/chat/sessions/${sessionId}`)
    applySessionDetail(detail)
  }

  async function fetchSessions() {
    const response = await $fetch<{ sessions: AdminChatSessionSummary[] }>('/api/admin/chat/sessions')
    sessions.value = sortSessions(response.sessions)
    return sessions.value
  }

  async function createSession() {
    if (isCreatingSession.value) {
      return
    }

    isCreatingSession.value = true
    errorMessage.value = ''

    try {
      const detail = await $fetch<AdminChatSessionDetail>('/api/admin/chat/sessions', {
        method: 'POST',
      })

      applySessionDetail(detail)
    }
    catch (error: any) {
      errorMessage.value = getErrorMessage(error)
    }
    finally {
      isCreatingSession.value = false
    }
  }

  async function recoverFromMissingSession() {
    activeSessionId.value = null
    await fetchSessions()

    if (!sessions.value.length) {
      await createSession()
      return
    }

    const fallbackSession = sessions.value[0]
    if (fallbackSession) {
      await loadSessionDetail(fallbackSession.id)
    }
  }

  async function selectSession(sessionId: string) {
    if (!sessionId || isTranscriptLoading.value) {
      return
    }

    isTranscriptLoading.value = true
    errorMessage.value = ''

    try {
      await loadSessionDetail(sessionId)
    }
    catch (error: any) {
      if (getStatusCode(error) === 404) {
        await recoverFromMissingSession()
        return
      }

      errorMessage.value = getErrorMessage(error)
    }
    finally {
      isTranscriptLoading.value = false
    }
  }

  async function initialize() {
    if (hasInitialized.value) {
      return
    }

    hasInitialized.value = true
    isSessionsLoading.value = true
    errorMessage.value = ''

    try {
      const nextSessions = await fetchSessions()

      if (!nextSessions.length) {
        await createSession()
        return
      }

      const preferredSessionId = nextSessions.some(session => session.id === activeSessionId.value)
        ? activeSessionId.value
        : nextSessions[0]?.id

      if (preferredSessionId) {
        await selectSession(preferredSessionId)
      }
    }
    catch (error: any) {
      errorMessage.value = getErrorMessage(error)
    }
    finally {
      isSessionsLoading.value = false
    }
  }

  async function sendPrompt() {
    const prompt = draft.value.trim()
    const sessionId = activeSessionId.value

    if (!prompt || !sessionId || isSending.value) {
      return
    }

    const previousMessages = [...messages.value]
    messages.value = [...previousMessages, {
      role: 'user',
      content: prompt,
    }]
    draft.value = ''
    errorMessage.value = ''
    isSending.value = true

    try {
      const detail = await $fetch<AdminChatPromptResponse>('/api/admin/chat', {
        method: 'POST',
        body: {
          sessionId,
          prompt,
        },
      })

      applySessionDetail(detail)
    }
    catch (error: any) {
      messages.value = previousMessages
      draft.value = prompt

      if (getStatusCode(error) === 404) {
        await recoverFromMissingSession()
        return
      }

      errorMessage.value = getErrorMessage(error)
    }
    finally {
      isSending.value = false
    }
  }

  async function deleteSession(sessionId: string) {
    if (isSending.value) {
      return
    }

    errorMessage.value = ''

    try {
      await $fetch<{ ok: boolean }>(`/api/admin/chat/sessions/${sessionId}` as string, { method: 'DELETE' })
      sessions.value = sessions.value.filter(s => s.id !== sessionId)

      if (activeSessionId.value === sessionId) {
        if (sessions.value.length > 0) {
          await selectSession(sessions.value[0]!.id)
        }
        else {
          activeSessionId.value = null
          messages.value = []
          await createSession()
        }
      }
    }
    catch (error: any) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  return {
    activeSession,
    activeSessionId,
    canSend,
    createSession,
    deleteSession,
    draft,
    errorMessage,
    initialize,
    isBusy,
    isCreatingSession,
    isSending,
    isSessionsLoading,
    isTranscriptLoading,
    messages,
    selectSession,
    sendPrompt,
    sessions,
  }
}
