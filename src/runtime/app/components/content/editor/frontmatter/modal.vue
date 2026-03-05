<script setup lang="ts">
import { computed } from 'vue'
import FrontmatterForm from './form.vue'

const { isOpen, schema } = defineProps<{
  isOpen: boolean
  schema: Record<string, any> | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const frontmatter = defineModel<any>('frontmatter', {
  required: true,
})

const hasFrontmatterSettings = computed(() => {
  return !!schema && Object.keys(schema).length > 0
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
    role="presentation"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-220 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-3"
      role="dialog"
      aria-modal="true"
      aria-label="Einstellungen"
    >
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-bold text-2xl">
          Einstellungen
        </h2>
        <button
          type="button"
          class="button secondary small"
          @click="emit('close')"
        >
          Schließen
        </button>
      </div>

      <div
        v-if="!hasFrontmatterSettings"
        class="text-sm p-4 bg-gray-100 text-gray-700 rounded"
      >
        Keine Einstellungen für diesen Inhalt vorhanden.
      </div>

      <div
        v-else
        class="max-h-[70vh] overflow-auto pl-1 pr-3"
      >
        <FrontmatterForm v-model:frontmatter="frontmatter" :schema="schema" />
      </div>
    </div>
  </div>
</template>
