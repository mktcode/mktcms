<script setup lang="ts">
import type { AdminChatSessionSummary } from '../../composables/useAdminChatSessions'

const props = withDefaults(defineProps<{
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
  delete: [sessionId: string]
  select: [sessionId: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-0.5 py-1">
    <!-- New session button -->
    <button
      type="button"
      class="flex items-center gap-2 w-full px-3 py-2 mb-1 bg-transparent border-none rounded-lg cursor-pointer text-left transition-colors duration-150 text-ds-on-surface-variant hover:bg-ds-surface-container-low hover:text-ds-on-surface disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled || isCreating"
      @click="emit('create')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4 shrink-0"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span class="text-sm font-semibold">{{ isCreating ? 'Erstellt…' : 'Neue Sitzung' }}</span>
    </button>

    <!-- Loading state -->
    <div
      v-if="isLoading && sessions.length === 0"
      class="px-3 py-2 text-xs text-ds-on-surface-variant"
    >
      Lädt…
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!isLoading && sessions.length === 0"
      class="px-3 py-2 text-xs text-ds-on-surface-variant"
    >
      Keine Sitzungen
    </div>

    <!-- Session list -->
    <div
      v-for="session in sessions"
      :key="session.id"
      class="group/sess flex items-center rounded-lg"
      :class="session.id === activeSessionId
        ? 'bg-ds-primary shadow-[inset_0_0.5rem_1rem_rgba(42,52,57,0.1)]'
        : ''"
    >
      <button
        type="button"
        class="flex-1 flex items-center gap-2 px-3 py-2.5 border-none bg-transparent cursor-pointer text-left min-w-0 rounded-lg transition-colors duration-150 disabled:cursor-not-allowed"
        :class="session.id === activeSessionId
          ? 'text-ds-on-primary'
          : 'text-ds-on-surface hover:bg-ds-surface-container-low'"
        :disabled="disabled || isLoading"
        @click="emit('select', session.id)"
      >
        <span class="flex-1 text-sm truncate">{{ session.label }}</span>
      </button>

      <button
        type="button"
        class="shrink-0 mr-1 flex items-center justify-center w-7 h-7 rounded-full border-none cursor-pointer transition-colors duration-150 opacity-0 group-hover/sess:opacity-100 disabled:cursor-not-allowed"
        :class="session.id === activeSessionId
          ? 'bg-transparent text-white/60 hover:text-white hover:bg-white/10'
          : 'bg-transparent text-ds-on-surface-variant hover:text-ds-on-surface hover:bg-ds-surface-container-high'"
        :disabled="disabled"
        title="Sitzung löschen"
        @click="emit('delete', session.id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-3.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
