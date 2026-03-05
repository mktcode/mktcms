<script setup lang="ts">
import { computed, watch } from 'vue'
import { useFetch } from '#app'
import FileIcon from '../../../fileIcon.vue'
import PickerNode from './node.vue'

const props = defineProps<{
  isOpen: boolean
  uiHint: 'image' | 'pdf' | 'file'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', path: string): void
}>()

const listQuery = computed(() => ({
  path: '',
  type: props.uiHint,
}))

const { data: list, pending, refresh } = await useFetch<{ files: string[], dirs: string[] }>('/api/admin/list', {
  query: listQuery,
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    refresh()
  }
})

function fileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/)
  return match && match[1] ? match[1] : ''
}

function filenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function selectFile(path: string) {
  emit('select', path)
  emit('close')
}

const title = computed(() => {
  if (props.uiHint === 'image') {
    return 'Bild auswählen'
  }

  if (props.uiHint === 'pdf') {
    return 'PDF auswählen'
  }

  return 'Datei auswählen'
})
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
    role="presentation"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-220 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-3"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-bold text-2xl">
          {{ title }}
        </h2>
        <button
          type="button"
          class="button secondary small"
          @click="emit('close')"
        >
          Schließen
        </button>
      </div>

      <div class="max-h-[70vh] overflow-auto pl-1 pr-3">
        <div
          v-if="pending"
          class="text-sm text-gray-500"
        >
          Laden...
        </div>

        <div
          v-else
          class="space-y-2"
        >
          <button
            v-for="file in (list?.files ?? [])"
            :key="file"
            type="button"
            class="w-full button secondary"
            @click="selectFile(file)"
          >
            <FileIcon :file-path="file" />
            <div class="w-full flex text-left">
              {{ filenameWithoutExtension(file) }}
              <span
                v-if="fileExtension(file)"
                class="text-sm text-gray-400 ml-auto"
              >
                .{{ fileExtension(file) }}
              </span>
            </div>
          </button>

          <PickerNode
            v-for="dir in (list?.dirs ?? [])"
            :key="dir"
            :path="dir"
            :name="dir"
            :level="0"
            :ui-hint="props.uiHint"
            @select="selectFile"
          />

          <div
            v-if="(list?.files?.length ?? 0) === 0 && (list?.dirs?.length ?? 0) === 0"
            class="text-sm text-gray-600"
          >
            Keine passenden Dateien gefunden.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
