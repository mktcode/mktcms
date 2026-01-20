<script setup lang="ts">
import { computed } from 'vue';

const { path } = defineProps<{ path: string }>()

const parts = computed(() => {
  const splitParts = path.split(':').filter(part => part.length > 0)
  splitParts.unshift('Hauptordner')
  return splitParts
})

defineEmits<{
  (e: 'update-path', newPathParts: string[]): void
}>()
</script>

<template>
  <div class="text-gray-500 text-base flex items-center gap-1">
    <div
      v-for="(part, index) in parts"
      :key="index"
      class="flex items-center gap-1"
    >
      <svg
        v-if="index > 0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
      <button
        v-if="index < parts.length - 1"
        class="button secondary small"
        @click="$emit('update-path', parts.slice(1, index + 1))"
      >
        {{ part }}
      </button>
      <span
        v-else
        class="font-bold"
      >
        {{ part }}
      </span>
    </div>
  </div>
</template>
