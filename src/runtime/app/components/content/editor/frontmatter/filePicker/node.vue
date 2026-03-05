<script setup lang="ts">
import { computed, ref } from 'vue'
import FileIcon from '../../../fileIcon.vue'

defineOptions({
  name: 'PickerNode',
})

const props = defineProps<{
  path: string
  name: string
  level: number
  uiHint: 'image' | 'pdf' | 'file'
}>()

const emit = defineEmits<{
  (e: 'select', path: string): void
}>()

const isExpanded = ref(false)
const isLoading = ref(false)
const files = ref<string[]>([])
const dirs = ref<string[]>([])

function filenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function fileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/)
  return match && match[1] ? match[1] : ''
}

function joinPath(basePath: string, name: string) {
  return `${basePath}${basePath ? ':' : ''}${name}`
}

async function toggleExpand() {
  isExpanded.value = !isExpanded.value

  if (isExpanded.value && files.value.length === 0 && dirs.value.length === 0 && !isLoading.value) {
    isLoading.value = true

    const data = await $fetch<{ files: string[], dirs: string[] }>('/api/admin/list', {
      query: { path: props.path, type: props.uiHint },
    })

    files.value = data.files
    dirs.value = data.dirs

    isLoading.value = false
  }
}

const indentStyle = computed(() => ({
  paddingLeft: `${props.level * 1.5}rem`,
}))

function selectFile(fileName: string) {
  emit('select', joinPath(props.path, fileName))
}
</script>

<template>
  <div>
    <div :style="indentStyle">
      <button
        type="button"
        class="button directory w-full flex items-center text-left"
        @click="toggleExpand"
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

        <span>{{ props.name }}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4 ml-auto transition-transform duration-300"
          :class="isExpanded ? 'rotate-90' : ''"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>

    <div
      class="grid transition-[grid-template-rows] duration-300 ease-in-out"
      :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div
          v-if="isLoading"
          class="py-2"
          :style="{ paddingLeft: `${(props.level + 1) * 1.5}rem` }"
        >
          <span class="text-sm text-gray-500">Laden...</span>
        </div>

        <div
          v-else
          class="py-2 space-y-2"
        >
          <div
            v-for="file in files"
            :key="file"
            class="flex"
            :style="{ paddingLeft: `${(props.level + 1) * 1.5}rem` }"
          >
            <button
              type="button"
              class="w-full button secondary"
              @click="selectFile(file)"
            >
              <FileIcon :file-path="joinPath(props.path, file)" />
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
          </div>

          <PickerNode
            v-for="dir in dirs"
            :key="dir"
            :path="joinPath(props.path, dir)"
            :name="dir"
            :level="props.level + 1"
            :ui-hint="props.uiHint"
            @select="emit('select', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
