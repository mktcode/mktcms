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
  <div class="flex flex-col items-stretch gap-3.5 pt-1">
    <div class="flex flex-col min-w-0 gap-1">
      <span class="text-[0.7rem] tracking-[0.14em] uppercase text-ds-on-surface-variant">Aktive Sitzung</span>
      <span class="font-display text-base font-semibold text-ds-on-surface truncate">{{ props.activeSession?.label || 'Neue Sitzung' }}</span>
      <span class="text-[0.8125rem] leading-relaxed text-ds-on-surface-variant">{{ props.activeSession?.preview || 'Noch keine Nachrichten' }}</span>
    </div>

    <div class="flex flex-col items-stretch gap-2.5 min-w-0 justify-start">
      <select
        class="min-w-0 h-11 px-3.5 border-none rounded-[0.875rem] bg-ds-surface-container-low text-ds-on-surface shadow-[0_0_0_1px_rgba(169,180,185,0.15)] focus:outline-2 focus:outline-[rgba(80,97,105,0.4)] focus:outline-offset-1"
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
        class="h-11 px-4 border-none rounded-[0.875rem] bg-ds-surface-container-highest text-ds-on-surface font-semibold whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="props.disabled || props.isCreating"
        @click="emit('create')"
      >
        {{ props.isCreating ? 'Erstellt...' : 'Neue Sitzung' }}
      </button>
    </div>
  </div>
</template>
