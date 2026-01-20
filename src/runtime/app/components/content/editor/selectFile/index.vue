<script setup lang="ts">
import { ref, watch } from '#imports';
import FileIcon from '../../fileIcon.vue';
import Breadcrumb from './breadcrumb.vue';

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
  await loadList()
}, { immediate: true })

function updatePath(newPathParts: string[]) {
  files.value = []
  dirs.value = []
  pathParts.value = newPathParts
}
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
      <Breadcrumb :path="pathParts.join(':')" @update-path="updatePath" />
      <div class="flex flex-col gap-2.5 max-h-96 overflow-y-auto">
        <div
          v-for="file in files"
          :key="file"
          class="button secondary"
          @click="selectFile(file)"
        >
          <FileIcon :filePath="[...pathParts, file].join(':')"/>
          {{ file }}
        </div>
        <div
          v-for="dir in dirs"
          :key="dir"
          class="button secondary"
          @click="updatePath([...pathParts, dir])"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 opacity-20"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
          />
        </svg>
          {{ dir }}
        </div>
      </div>
    </div>
  </div>
</template>