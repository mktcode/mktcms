<script setup lang="ts">
import type { AdminChatSessionSummary } from '../../composables/useAdminChatSessions'

const props = withDefaults(defineProps<{
  activeSession: AdminChatSessionSummary | null
  activeSessionId: string | null
  disabled?: boolean
  isCreating?: boolean
  isLoading?: boolean
  sessions: AdminChatSessionSummary[]
}>(), {
  disabled: false,
  isCreating: false,
  isLoading: false,
})

const emit = defineEmits<{
  create: []
  select: [sessionId: string]
}>()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value) {
    emit('select', value)
  }
}
</script>

<template>
  <div class="chat-session-bar">
    <div class="chat-session-copy">
      <span class="chat-session-label">Aktive Sitzung</span>
      <span class="chat-session-preview">{{ props.activeSession?.label || 'Neue Sitzung' }}</span>
      <span class="chat-session-meta">{{ props.activeSession?.preview || 'Noch keine Nachrichten' }}</span>
    </div>

    <div class="chat-session-actions">
      <select
        class="chat-session-select"
        :value="props.activeSessionId || ''"
        :disabled="props.disabled || props.isLoading || props.sessions.length === 0"
        @change="onChange"
      >
        <option
          v-for="session in props.sessions"
          :key="session.id"
          :value="session.id"
        >
          {{ session.label }}
        </option>
      </select>

      <button
        type="button"
        class="chat-session-new"
        :disabled="props.disabled || props.isCreating"
        @click="emit('create')"
      >
        {{ props.isCreating ? 'Erstellt...' : 'Neue Sitzung' }}
      </button>
    </div>
  </div>
</template>
