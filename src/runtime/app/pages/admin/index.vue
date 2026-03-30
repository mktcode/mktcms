<script setup lang="ts">
import Admin from '../../components/admin.vue'
import AdminWorkspace from '../../components/adminWorkspace.vue'
import ChatInputBar from '../../components/chat/inputBar.vue'
import ChatTranscript from '../../components/chat/transcript.vue'
import { useAdminChatSessions } from '../../composables/useAdminChatSessions'

const promptTemplates = [
  {
    label: 'News ergänzen',
    description: 'Neue Meldung mit Titel, Datum und Kurztext anlegen.',
    prompt: 'Lege eine neue News-Meldung an. Frage mich nach Titel, Datum, Bild und Text, falls etwas fehlt.',
  },
  {
    label: 'Bild ersetzen',
    description: 'Ein bestehendes Asset austauschen und Verwendungen prüfen.',
    prompt: 'Ersetze ein bestehendes Bild. Frage mich nach dem Dateipfad und dem neuen Motiv oder der neuen Datei. Prüfe auch, wo das Bild verwendet wird.',
  },
  {
    label: 'Seite überarbeiten',
    description: 'Text, Struktur oder CTA auf einer vorhandenen Seite anpassen.',
    prompt: 'Überarbeite eine bestehende Seite. Frage mich nach dem Inhaltspfad und welche Bereiche geändert werden sollen.',
  },
] as const

const {
  activeSessionId,
  canSend,
  draft,
  errorMessage,
  isBusy,
  isSending,
  isSessionsLoading,
  isTranscriptLoading,
  messages,
  sendPrompt,
} = useAdminChatSessions()

function applyPromptTemplate(prompt: string) {
  const currentDraft = draft.value.trim()
  draft.value = currentDraft ? `${currentDraft}\n\n${prompt}` : prompt
}
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <ChatTranscript
        :messages="messages"
        :is-loading="isTranscriptLoading || isSessionsLoading"
        :is-sending="isSending"
      />

      <div
        v-if="errorMessage"
        class="px-4 pb-2 md:px-6"
      >
        <div class="flex gap-3 items-center px-4 py-3 rounded-2xl text-sm bg-ds-error-container text-ds-error">
          {{ errorMessage }}
        </div>
      </div>

      <div class="px-3 pb-3 md:px-4">
        <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] max-md:grid-cols-1">
          <button
            v-for="template in promptTemplates"
            :key="template.label"
            type="button"
            class="flex flex-col items-start gap-[0.4rem] p-4 bg-ds-surface-container-lowest border-none rounded-2xl shadow-ambient cursor-pointer text-left transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0"
            :disabled="isSending"
            @click="applyPromptTemplate(template.prompt)"
          >
            <span class="font-display text-base font-semibold text-ds-on-surface">{{ template.label }}</span>
            <span class="text-[0.8125rem] leading-relaxed text-ds-on-surface-variant">{{ template.description }}</span>
          </button>
        </div>
      </div>

      <ChatInputBar
        v-model="draft"
        :disabled="isSending || isBusy || !activeSessionId"
        :can-send="canSend"
        @send="sendPrompt"
      />
    </AdminWorkspace>
  </Admin>
</template>
