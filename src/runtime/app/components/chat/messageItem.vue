<script setup lang="ts">
import type { AdminChatMessage } from '../../composables/useAdminChatSessions'

const props = defineProps<{
  message: AdminChatMessage
}>()

function agentLabel(agent?: AdminChatMessage['agent']) {
  return agent === 'coding' ? 'Code' : 'Chat'
}
</script>

<template>
  <div
    class="flex gap-3 md:gap-4"
    :class="props.message.role === 'user' ? 'flex-row-reverse' : ''"
  >
    <div
      class="chat-avatar shrink-0"
      :class="props.message.role === 'user' ? 'chat-avatar-user' : 'chat-avatar-assistant'"
    >
      <svg
        v-if="props.message.role === 'assistant'"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-5"
      >
        <path d="M12 8V4H8" />
        <rect
          width="16"
          height="12"
          x="4"
          y="8"
          rx="2"
        />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
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

    <div
      class="flex max-w-[min(100%,42rem)] flex-col"
      :class="props.message.role === 'user' ? 'items-end ml-auto' : ''"
    >
      <div :class="props.message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'">
        <pre class="whitespace-pre-wrap font-body leading-normal">{{ props.message.content }}</pre>
      </div>
      <div class="chat-meta mt-2">
        {{ props.message.role === 'user' ? 'USER' : 'ASSISTANT' }}
        <span
          v-if="props.message.role === 'assistant' && props.message.agent"
          class="opacity-60"
        >
          · {{ agentLabel(props.message.agent) }}
        </span>
      </div>
    </div>
  </div>
</template>
