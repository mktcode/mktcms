<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import type { AdminChatMessage } from '../../composables/useAdminChatSessions'
import MessageItem from './messageItem.vue'

const props = withDefaults(defineProps<{
  isLoading?: boolean
  isSending?: boolean
  messages: AdminChatMessage[]
}>(), {
  isLoading: false,
  isSending: false,
})

const transcript = useTemplateRef<HTMLDivElement>('transcript')

function scrollTranscriptToBottom() {
  transcript.value?.scrollTo({
    top: transcript.value.scrollHeight,
    behavior: 'smooth',
  })
}

watch(() => [props.messages.length, props.isSending], async () => {
  await nextTick()
  scrollTranscriptToBottom()
})
</script>

<template>
  <div
    ref="transcript"
    class="flex-1 flex flex-col overflow-y-auto px-4 pb-4 md:px-6 min-h-0"
  >
    <div
      v-if="props.isLoading && props.messages.length === 0"
      class="flex-1 flex flex-col items-center justify-center gap-4 text-center min-h-64 pt-12 pb-8 lg:min-h-80 lg:py-12"
    >
      <p
        class="text-sm max-w-xl"
        style="color: var(--color-ds-on-surface-variant);"
      >
        Sitzung wird geladen...
      </p>
    </div>

    <div
      v-else-if="props.messages.length === 0"
      class="flex-1 flex flex-col items-center justify-center gap-4 text-center min-h-64 pt-12 pb-8 lg:min-h-80 lg:py-12"
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
        class="text-sm max-w-xl"
        style="color: var(--color-ds-on-surface-variant);"
      >
        Geben Sie Änderungen in natürlicher Sprache in Auftrag. Einfache inhaltliche oder strukturelle Änderungen werden automatisiert durchgeführt. Komplexere Anfragen, wie z.B. die Implementierung neuer Funktionen, können hier vorbereitet und an Ihren Websitebetreiber weitergeleitet werden.
      </p>
    </div>

    <div
      v-else
      class="flex min-h-full flex-col gap-5 py-4 md:gap-6 md:py-8"
    >
      <MessageItem
        v-for="(message, index) in props.messages"
        :key="`${message.role}-${index}-${message.content.length}`"
        :message="message"
      />

      <div
        v-if="props.isSending"
        class="flex gap-3"
      >
        <div class="size-8 rounded-full flex items-center justify-center shrink-0 md:size-10 bg-linear-to-br from-ds-primary to-ds-secondary text-ds-on-primary">
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
        <div class="max-w-3xl px-8 py-6 bg-ds-surface-container-lowest rounded-[1.25rem] rounded-tl-none shadow-ambient text-ds-on-surface">
          <span
            class="text-sm"
            style="color: var(--color-ds-on-surface-variant);"
          >Antwort wird erzeugt...</span>
        </div>
      </div>
    </div>
  </div>
</template>
