<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

type AgentAnswer = {
  id: string
  answer: string
}

type AgentAttachmentPayload = {
  name: string
  type: string
  size: number
  textContent?: string
  base64Content?: string
}

type AgentQuestion = {
  id: string
  question: string
  options: Array<{ label: string, value: string }>
  allowCustomInput: boolean
}

type AgentResponse = {
  status: 'question' | 'done' | 'unsupported'
  message: string
  questions?: AgentQuestion[]
  changedFiles?: string[]
  warnings?: string[]
  gitSync?: 'ok' | 'failed' | 'skipped'
}

type LocalAttachment = {
  id: string
  name: string
  type: string
  size: number
  previewUrl?: string
  textContent?: string
  base64Content?: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const prompt = ref('')
const errorMessage = ref('')
const resultMessage = ref('')
const changedFiles = ref<string[]>([])
const warnings = ref<string[]>([])
const gitSync = ref<'ok' | 'failed' | 'skipped'>('skipped')
const isSubmitting = ref(false)

const questions = ref<AgentQuestion[]>([])
const answers = ref<AgentAnswer[]>([])
const customAnswer = ref('')

const fileInput = ref<HTMLInputElement | null>(null)
const attachments = ref<LocalAttachment[]>([])

const recognition = ref<any | null>(null)
const isListening = ref(false)

const activeQuestion = computed(() => questions.value[0] || null)

function resetResultState() {
  resultMessage.value = ''
  changedFiles.value = []
  warnings.value = []
  gitSync.value = 'skipped'
  errorMessage.value = ''
}

function closeModal() {
  stopVoiceInput()
  emit('close')
}

function openFilePicker() {
  fileInput.value?.click()
}

function removeAttachment(id: string) {
  const attachment = attachments.value.find(item => item.id === id)
  if (attachment?.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl)
  }

  attachments.value = attachments.value.filter(item => item.id !== id)
}

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const [, base64 = ''] = result.split(',')
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'))
    reader.readAsDataURL(file)
  })
}

function isTextLike(file: File) {
  if (file.type.startsWith('text/')) {
    return true
  }

  return /\.(md|txt|csv|json|ya?ml)$/i.test(file.name)
}

async function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) {
    return
  }

  const selectedFiles = Array.from(input.files)

  for (const file of selectedFiles.slice(0, 8)) {
    const id = `${file.name}-${file.size}-${Math.random().toString(16).slice(2)}`
    const attachment: LocalAttachment = {
      id,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
    }

    if (file.type.startsWith('image/')) {
      attachment.previewUrl = URL.createObjectURL(file)
    }

    if (isTextLike(file)) {
      const content = await file.text()
      attachment.textContent = content.slice(0, 20000)
    }
    else {
      const base64 = await toBase64(file)
      attachment.base64Content = base64.slice(0, 450000)
    }

    attachments.value.push(attachment)
  }

  input.value = ''
}

function upsertAnswer(nextAnswer: AgentAnswer) {
  const existingIndex = answers.value.findIndex(item => item.id === nextAnswer.id)
  if (existingIndex >= 0) {
    answers.value[existingIndex] = nextAnswer
    return
  }

  answers.value.push(nextAnswer)
}

function getAttachmentPayload(): AgentAttachmentPayload[] {
  return attachments.value.map(item => ({
    name: item.name,
    type: item.type,
    size: item.size,
    textContent: item.textContent,
    base64Content: item.base64Content,
  }))
}

async function runAgent() {
  if (!prompt.value.trim()) {
    errorMessage.value = 'Bitte gib zuerst einen Prompt ein.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<AgentResponse>('/api/admin/agent', {
      method: 'POST',
      body: {
        prompt: prompt.value,
        answers: answers.value,
        attachments: getAttachmentPayload(),
      },
    })

    if (response.status === 'question') {
      questions.value = response.questions || []
      resultMessage.value = response.message
      return
    }

    questions.value = []
    resultMessage.value = response.message
    changedFiles.value = response.changedFiles || []
    warnings.value = response.warnings || []
    gitSync.value = response.gitSync || 'skipped'
  }
  catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Der KI-Agent konnte nicht ausgeführt werden.'
  }
  finally {
    isSubmitting.value = false
  }
}

async function submitPrompt() {
  resetResultState()
  answers.value = []
  questions.value = []
  customAnswer.value = ''
  await runAgent()
}

async function answerWithOption(optionValue: string) {
  if (!activeQuestion.value) {
    return
  }

  upsertAnswer({ id: activeQuestion.value.id, answer: optionValue })
  questions.value = questions.value.slice(1)
  customAnswer.value = ''
  await runAgent()
}

async function answerWithCustomInput() {
  if (!activeQuestion.value || !customAnswer.value.trim()) {
    return
  }

  upsertAnswer({ id: activeQuestion.value.id, answer: customAnswer.value.trim() })
  questions.value = questions.value.slice(1)
  customAnswer.value = ''
  await runAgent()
}

function appendTranscript(text: string) {
  if (!text.trim()) {
    return
  }

  prompt.value = `${prompt.value.trim()} ${text.trim()}`.trim()
}

function stopVoiceInput() {
  if (recognition.value) {
    recognition.value.stop()
  }
  isListening.value = false
}

function startVoiceInput() {
  const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognitionCtor) {
    errorMessage.value = 'Spracherkennung wird in diesem Browser nicht unterstützt.'
    return
  }

  if (!recognition.value) {
    const instance = new SpeechRecognitionCtor()
    instance.lang = 'de-DE'
    instance.continuous = false
    instance.interimResults = true

    instance.onresult = (event: any) => {
      let transcript = ''
      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index]?.[0]?.transcript || ''
      }
      appendTranscript(transcript)
    }

    instance.onerror = () => {
      isListening.value = false
    }

    instance.onend = () => {
      isListening.value = false
    }

    recognition.value = instance
  }

  errorMessage.value = ''
  isListening.value = true
  recognition.value.start()
}

function toggleVoiceInput() {
  if (isListening.value) {
    stopVoiceInput()
    return
  }

  startVoiceInput()
}

function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  const kb = size / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

onBeforeUnmount(() => {
  stopVoiceInput()
  for (const attachment of attachments.value) {
    if (attachment.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl)
    }
  }
})
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 bg-black/45 flex items-start justify-center p-4 z-9999 overflow-y-auto"
    role="presentation"
    @click.self="closeModal"
  >
    <div
      class="w-full max-w-140 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-4 max-h-[calc(100vh-2rem)] my-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Agent"
    >
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-bold text-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          Agent
        </h2>
        <button
          type="button"
          class="button secondary small"
          @click="closeModal"
        >
          Schließen
        </button>
      </div>

      <p class="text-sm p-3 bg-gray-50 border border-gray-200 rounded">
        Der Agent unterstützt aktuell: Dateien ersetzen, Referenzen austauschen, Markdown/MDC bearbeiten.
      </p>

      <p
        v-if="errorMessage"
        class="text-sm p-3 bg-red-100 text-red-700 rounded"
      >
        {{ errorMessage }}
      </p>

      <div class="min-h-0 overflow-y-auto pr-1 flex flex-col gap-3">
        <div
          v-if="resultMessage"
          class="text-sm p-3 bg-gray-50 border border-gray-200 rounded"
        >
          {{ resultMessage }}
        </div>

        <div
          v-if="changedFiles.length > 0"
          class="text-sm p-3 bg-emerald-100 text-emerald-800 rounded"
        >
          <p class="font-medium mb-1">
            Geänderte Dateien:
          </p>
          <ul class="flex flex-col gap-1">
            <li
              v-for="file in changedFiles"
              :key="file"
              class="break-all"
            >
              {{ file }}
            </li>
          </ul>
          <p
            v-if="gitSync === 'failed'"
            class="text-red-700 mt-2"
          >
            Git-Sync fehlgeschlagen, Änderungen wurden dennoch gespeichert.
          </p>
        </div>

        <div
          v-if="warnings.length > 0"
          class="text-sm p-3 bg-amber-100 text-amber-900 rounded"
        >
          <p class="font-medium mb-1">
            Hinweise:
          </p>
          <ul class="flex flex-col gap-1">
            <li
              v-for="warning in warnings"
              :key="warning"
            >
              {{ warning }}
            </li>
          </ul>
        </div>

        <div
          v-if="activeQuestion"
          class="p-3 border border-gray-200 rounded bg-gray-50 flex flex-col gap-2"
        >
          <p class="font-medium">
            Rückfrage: {{ activeQuestion.question }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in activeQuestion.options"
              :key="option.value"
              type="button"
              class="button secondary small"
              :disabled="isSubmitting"
              @click="answerWithOption(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <div
            v-if="activeQuestion.allowCustomInput"
            class="flex gap-2"
          >
            <input
              v-model="customAnswer"
              type="text"
              :placeholder="'Eigene Antwort zu ' + activeQuestion.question"
            >
            <button
              type="button"
              class="button small"
              :disabled="isSubmitting || !customAnswer.trim()"
              @click="answerWithCustomInput"
            >
              Senden
            </button>
          </div>
        </div>

        <div
          v-if="attachments.length > 0"
          class="p-3 border border-gray-200 rounded bg-white flex flex-col gap-2"
        >
          <p class="text-sm text-gray-600">
            Anhänge (temporär)
          </p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="attachment in attachments"
              :key="attachment.id"
              class="flex items-center gap-2 p-2 border border-gray-200 rounded bg-gray-50"
            >
              <img
                v-if="attachment.previewUrl"
                :src="attachment.previewUrl"
                :alt="attachment.name"
                class="size-10 rounded object-cover"
              >
              <div class="max-w-56">
                <p class="text-sm font-medium break-all">
                  {{ attachment.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatSize(attachment.size) }}
                </p>
              </div>
              <button
                type="button"
                class="button secondary small"
                @click="removeAttachment(attachment.id)"
              >
                Entfernen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-gray-200 rounded p-2 flex flex-col gap-2">
        <textarea
          v-model="prompt"
          rows="3"
          placeholder="Beschreibe die gewünschte Änderung…"
          class="w-full border-0 focus:outline-none resize-y"
        />

        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="button secondary small"
              :disabled="isSubmitting"
              @click="openFilePicker"
            >
              Datei
            </button>
            <button
              type="button"
              class="button secondary small"
              :disabled="isSubmitting"
              @click="toggleVoiceInput"
            >
              <span v-if="isListening">🎙️ Stop</span>
              <span v-else>🎤</span>
            </button>
          </div>

          <button
            type="button"
            class="button small"
            :disabled="isSubmitting || !prompt.trim()"
            @click="submitPrompt"
          >
            <span v-if="isSubmitting">läuft…</span>
            <span v-else>Senden</span>
          </button>
        </div>

        <input
          ref="fileInput"
          type="file"
          class="hidden"
          multiple
          @change="onFilesSelected"
        >
      </div>
    </div>
  </div>
</template>
