<script setup lang="ts">
import { onMounted } from 'vue'
import Admin from '../../components/admin.vue'
import AdminWorkspace from '../../components/adminWorkspace.vue'
import ChatInputBar from '../../components/chat/inputBar.vue'
import ChatSessionBar from '../../components/chat/sessionBar.vue'
import ChatTranscript from '../../components/chat/transcript.vue'
import { useAdminChatSessions } from '../../composables/useAdminChatSessions'

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
        <div class="alert-error">
          {{ errorMessage }}
        </div>
      </div>

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

      <ChatInputBar
        v-model="draft"
        :disabled="isSending || isBusy || !activeSessionId"
        :can-send="canSend"
        @send="sendPrompt"
      />
    </AdminWorkspace>
  </Admin>
</template>
