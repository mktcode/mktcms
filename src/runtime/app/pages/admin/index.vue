<script setup lang="ts">
import { onMounted } from 'vue'
import Admin from '../../components/admin.vue'
import AdminWorkspace from '../../components/adminWorkspace.vue'
import ChatInputBar from '../../components/chat/inputBar.vue'
import ChatSessionBar from '../../components/chat/sessionBar.vue'
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
  activeSession,
  activeSessionId,
  canSend,
  createSession,
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
} = useAdminChatSessions()

onMounted(() => {
  void initialize()
})

function applyPromptTemplate(prompt: string) {
  const currentDraft = draft.value.trim()
  draft.value = currentDraft ? `${currentDraft}\n\n${prompt}` : prompt
}
</script>

<template>
  <Admin>
    <AdminWorkspace primary-sidebar-label="Chats">
      <template #sidebarPrimary>
        <ChatSessionBar
          :sessions="sessions"
          :active-session="activeSession"
          :active-session-id="activeSessionId"
          :disabled="isSending"
          :is-loading="isTranscriptLoading"
          :is-creating="isCreatingSession"
          @select="selectSession"
          @create="createSession"
        />
      </template>

      <ChatTranscript
        :messages="messages"
        :is-loading="isTranscriptLoading || isSessionsLoading"
        :is-sending="isSending"
      />

      <div
        v-if="errorMessage"
        class="px-4 pb-2 md:px-6"
      >
        <div class="alert-error">
          {{ errorMessage }}
        </div>
      </div>

      <div class="px-4 pb-3 md:px-6">
        <div class="chat-prompt-templates">
          <button
            v-for="template in promptTemplates"
            :key="template.label"
            type="button"
            class="chat-prompt-template"
            :disabled="isSending"
            @click="applyPromptTemplate(template.prompt)"
          >
            <span class="chat-prompt-template-kicker">Prompt</span>
            <span class="chat-prompt-template-label">{{ template.label }}</span>
            <span class="chat-prompt-template-copy">{{ template.description }}</span>
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
