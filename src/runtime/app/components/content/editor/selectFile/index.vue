<script setup lang="ts">
import { ref, watch } from '#imports';

const { isOpen } = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'select', filePath: string): void
  (e: 'close'): void
}>()

function selectFile(filePath: string) {
  const fullPath = [...pathParts.value, filePath].join('/')
  emit('select', fullPath)
  emit('close')
}

const pathParts = ref<string[]>([])
const files = ref<string[]>([])
const dirs = ref<string[]>([])

async function loadList() {
  const list = await $fetch('/api/admin/list', {
    query: {
      path: pathParts.value.join(':'),
      type: 'image',
    },
  })

  files.value = list.files
  dirs.value = list.dirs
}

watch(() => pathParts.value, async () => {
  console.log('Path parts changed:', pathParts.value)
  await loadList()
}, { immediate: true })
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
    role="presentation"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-180 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-3.5 flex flex-col gap-2.5"
      role="dialog"
      aria-modal="true"
      aria-label="Datei auswählen"
    >
      <button type="button" class="button" @click="pathParts = pathParts.slice(0, -1)" v-if="pathParts.length > 0">
        zurück
      </button>
      <div class="flex flex-col gap-2.5 max-h-96 overflow-y-auto">
        <div
          v-for="file in files"
          :key="file"
          class="p-2 rounded hover:bg-gray-100 cursor-pointer"
          @click="selectFile(file)"
        >
          {{ file }}
        </div>
        <div
          v-for="dir in dirs"
          :key="dir"
          class="p-2 rounded hover:bg-gray-100 cursor-pointer font-bold"
          @click="pathParts = [...pathParts, dir]"
        >
          {{ dir }}/
        </div>
      </div>
    </div>
  </div>
</template>