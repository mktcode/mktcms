<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#app'
import FileIcon from './fileIcon.vue'

const props = defineProps<{
  path: string
  name: string
  isDirectory: boolean
  level: number
}>()

const isExpanded = ref(false)
const isLoading = ref(false)
const files = ref<string[]>([])
const dirs = ref<string[]>([])
const route = useRoute()

const currentPath = computed(() => {
  return typeof route.params.path === 'string' ? route.params.path : ''
})

const isActiveBranch = computed(() => {
  return currentPath.value === props.path || currentPath.value.startsWith(`${props.path}:`)
})

function filenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function fileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/)
  return match && match[1] ? match[1] : ''
}

async function loadContents() {
  if (files.value.length > 0 || dirs.value.length > 0 || isLoading.value) {
    return
  }

  isLoading.value = true
  const data = await $fetch('/api/admin/list', {
    query: { path: props.path },
  })
  if (data) {
    files.value = data.files
    dirs.value = data.dirs
  }
  isLoading.value = false
}

async function toggleExpand() {
  if (!props.isDirectory) return

  isExpanded.value = !isExpanded.value

  if (isExpanded.value) {
    await loadContents()
  }
}

const indentStyle = {
  paddingLeft: `${props.level * 1}rem`,
}

function isActiveFile(path: string) {
  return currentPath.value === path
}

watch(isActiveBranch, async (active) => {
  if (active) {
    isExpanded.value = true
    await loadContents()
  }
}, { immediate: true })
</script>

<template>
  <div>
    <!-- Directory Item -->
    <div v-if="isDirectory">
      <button
        class="file-item w-full text-left"
        :class="{ active: isActiveBranch }"
        :style="indentStyle"
        style="font-weight: 600;"
        @click="toggleExpand"
      >
        <!-- Folder Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="file-item-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
          />
        </svg>

        <span class="file-item-label">{{ name }}</span>

        <!-- Chevron Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-3.5 shrink-0 transition-transform duration-300"
          style="color: var(--color-ds-on-surface-variant);"
          :class="isExpanded ? 'rotate-90' : ''"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <!-- Collapsible Content -->
      <div
        class="grid transition-[grid-template-rows] duration-300 ease-in-out"
        :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div
            v-if="isLoading"
            class="py-2"
            :style="{ paddingLeft: `${(level + 1) * 1}rem` }"
          >
            <span
              class="text-xs"
              style="color: var(--color-ds-on-surface-variant);"
            >Laden...</span>
          </div>
          <div
            v-else
            class="flex flex-col gap-0.5 py-1"
          >
            <!-- Files -->
            <NuxtLink
              v-for="file in files"
              :key="file"
              :to="`/admin/edit/${fileExtension(file) === 'md' ? 'markdown/' : 'file/'}${path}${path ? ':' : ''}${file}`"
              class="file-item"
              :class="{ active: isActiveFile(`${path}${path ? ':' : ''}${file}`) }"
              :style="{ paddingLeft: `${(level + 1) * 1 + 0.75}rem` }"
            >
              <FileIcon :file-path="`${path}${path ? ':' : ''}${file}`" />
              <span class="file-item-label">{{ filenameWithoutExtension(file) }}</span>
              <span
                v-if="fileExtension(file)"
                class="file-item-ext"
              >.{{ fileExtension(file) }}</span>
            </NuxtLink>

            <!-- Subdirectories -->
            <TreeNode
              v-for="dir in dirs"
              :key="dir"
              :path="`${path}${path ? ':' : ''}${dir}`"
              :name="dir"
              :is-directory="true"
              :level="level + 1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- File Item (non-directory) -->
    <NuxtLink
      v-else
      :to="`/admin/edit/${fileExtension(name) === 'md' ? 'markdown/' : 'file/'}${path}`"
      class="file-item"
      :style="indentStyle"
    >
      <FileIcon :file-path="path" />
      <span class="file-item-label">{{ filenameWithoutExtension(name) }}</span>
      <span
        v-if="fileExtension(name)"
        class="file-item-ext"
      >.{{ fileExtension(name) }}</span>
    </NuxtLink>
  </div>
</template>
