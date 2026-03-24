<script setup lang="ts">
import { useHead } from '#imports'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import Admin from '../../components/admin.vue'
import Header from '../../components/header.vue'

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

useHead({
  title: 'Admin Chat',
})

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
    <div class="boxed">
      <Header class="mb-4" />

      <div class="flex min-h-0 flex-1 flex-col gap-4">
        <div class="flex flex-col gap-2 border-b border-gray-200 pb-4">
          <div class="flex items-center justify-between gap-3">
            <h1 class="text-2xl md:text-3xl">
              Admin Chat
            </h1>
          </div>
          <p class="max-w-3xl text-sm text-gray-600">
            Fragen zu Inhalten, Texten und Workflows gehen an den Gesprächs-Agenten. Technische Fragen zu Code, APIs und Konfiguration gehen an den Coding-Agenten, der Dateien in diesem Projekt auch direkt anpassen kann.
          </p>
        </div>

        <div
          ref="transcript"
          class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
        >
          <div
            v-if="messages.length === 0"
            class="rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-6 text-sm text-gray-600"
          >
            Beispiele: „Schreib mir einen Einleitungstext für die Startseite“, „Warum liefert mein Nuxt Endpoint einen 401?“ oder „Füge dem Chat eine Verlaufsliste hinzu und ändere die API entsprechend.“
          </div>

          <div
            v-for="(message, index) in messages"
            :key="`${message.role}-${index}`"
            :class="message.role === 'user' ? 'ml-auto bg-emerald-600 text-white' : 'mr-auto bg-white text-gray-800 border border-gray-200'"
            class="max-w-3xl rounded-3xl px-4 py-3 shadow-sm"
          >
            <div class="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] opacity-75">
              <span>{{ message.role === 'user' ? 'Admin' : 'Assistent' }}</span>
              <span
                v-if="message.role === 'assistant'"
                class="rounded-full border border-current/15 px-2 py-1 text-[10px]"
              >
                {{ agentLabel(message.agent) }}
              </span>
            </div>
            <pre class="whitespace-pre-wrap text-sm leading-6">
              {{ message.content }}
            </pre>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <form
          class="grid gap-3 border-t border-gray-200 pt-4"
          @submit.prevent="sendMessage"
        >
          <textarea
            v-model="draft"
            rows="4"
            placeholder="Nachricht eingeben..."
            :disabled="isSending"
            @keydown.enter.exact.prevent="sendMessage"
          />

          <div class="flex items-center justify-between gap-3">
            <p class="text-xs text-gray-500">
              Enter sendet. Shift + Enter erstellt eine neue Zeile.
            </p>
            <button
              type="submit"
              class="button"
              :disabled="!canSend"
            >
              {{ isSending ? 'Antwort wird erzeugt...' : 'Senden' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Admin>
</template>
