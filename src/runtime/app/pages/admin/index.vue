<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import Admin from '../../components/admin.vue'
import AdminWorkspace from '../../components/adminWorkspace.vue'

// ── Chat logic ──────────────────────────────
type ChatRole = 'user' | 'assistant'
type ChatAgent = 'conversation' | 'coding'

type ChatMessage = {
  role: ChatRole
  content: string
  agent?: ChatAgent
}

const messages = ref<ChatMessage[]>([])
const draft = ref('')
const isSending = ref(false)
const errorMessage = ref('')
const transcript = useTemplateRef<HTMLDivElement>('transcript')

const canSend = computed(() => draft.value.trim().length > 0 && !isSending.value)

function agentLabel(agent?: ChatAgent) {
  return agent === 'coding' ? 'Code' : 'Chat'
}

function scrollTranscriptToBottom() {
  transcript.value?.scrollTo({
    top: transcript.value.scrollHeight,
    behavior: 'smooth',
  })
}

function toPayloadMessages(items: ChatMessage[]) {
  return items.map(({ role, content }) => ({ role, content }))
}

async function sendMessage() {
  const content = draft.value.trim()

  if (!content || isSending.value) {
    return
  }

  const nextMessages = [...messages.value, { role: 'user', content } satisfies ChatMessage]

  messages.value = nextMessages
  draft.value = ''
  errorMessage.value = ''
  isSending.value = true

  try {
    const response = await $fetch<{ agent: ChatAgent, message: string }>('/api/admin/chat', {
      method: 'POST',
      body: {
        messages: toPayloadMessages(nextMessages),
      },
    })

    messages.value = [...nextMessages, {
      role: 'assistant',
      content: response.message,
      agent: response.agent,
    }]
  }
  catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Die Anfrage konnte nicht verarbeitet werden.'
  }
  finally {
    isSending.value = false
    await nextTick()
    scrollTranscriptToBottom()
  }
}

watch(messages, async () => {
  await nextTick()
  scrollTranscriptToBottom()
}, { deep: true })
</script>

<template>
  <Admin>
    <AdminWorkspace>
        <div
          ref="transcript"
          class="admin-main-content chat-transcript"
        >
          <div
            v-if="messages.length === 0"
            class="chat-empty-state"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="size-16"
              style="color: var(--color-ds-on-surface-variant); opacity: 0.3;"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
            <p
              class="text-sm max-w-md"
              style="color: var(--color-ds-on-surface-variant);"
            >
              Fragen zu Inhalten, Texten und Workflows gehen an den Gesprächs-Agenten. Technische Fragen zu Code, APIs und Konfiguration gehen an den Coding-Agenten.
            </p>
          </div>

          <div
            v-else
            class="flex min-h-full flex-col gap-5 py-2 md:gap-6 md:py-4"
          >
            <div
              v-for="(message, index) in messages"
              :key="`${message.role}-${index}`"
              class="flex gap-3 md:gap-4"
              :class="message.role === 'user' ? 'flex-row-reverse' : ''"
            >
              <!-- Avatar -->
              <div
                class="chat-avatar shrink-0"
                :class="message.role === 'user' ? 'chat-avatar-user' : 'chat-avatar-assistant'"
              >
                <svg
                  v-if="message.role === 'assistant'"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>

              <!-- Bubble + meta -->
              <div
                class="flex max-w-[min(100%,42rem)] flex-col"
                :class="message.role === 'user' ? 'items-end ml-auto' : ''"
              >
                <div :class="message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'">
                  <pre class="whitespace-pre-wrap text-sm leading-6">{{ message.content }}</pre>
                </div>
                <div class="chat-meta mt-2">
                  {{ message.role === 'user' ? 'USER' : 'ASSISTANT' }}
                  <span
                    v-if="message.role === 'assistant' && message.agent"
                    class="opacity-60"
                  >
                    · {{ agentLabel(message.agent) }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="isSending"
              class="flex gap-3"
            >
              <div class="chat-avatar chat-avatar-assistant shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5 animate-spin"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                  />
                </svg>
              </div>
              <div class="chat-bubble-assistant">
                <span
                  class="text-sm"
                  style="color: var(--color-ds-on-surface-variant);"
                >Antwort wird erzeugt...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="px-4 pb-2 md:px-6"
        >
          <div class="alert-error">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Chat input bar -->
        <div class="chat-input-bar">
          <button
            type="button"
            class="chat-input-icon"
            tabindex="-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </button>

          <textarea
            v-model="draft"
            rows="1"
            class="chat-input-textarea"
            placeholder="Ask Website Assistant to build, edit or analyze..."
            :disabled="isSending"
            @keydown.enter.exact.prevent="sendMessage"
          />

          <button
            type="button"
            class="chat-send-button"
            :disabled="!canSend"
            @click="sendMessage"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
    </AdminWorkspace>
  </Admin>
</template>
