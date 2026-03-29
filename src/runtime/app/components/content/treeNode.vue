<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#app'
import FileIcon from './fileIcon.vue'

const props = defineProps<{
  path: string
  name: string
}>()

const isExpanded = ref(false)
const isLoading = ref(false)
const files = ref<string[]>([])
const dirs = ref<string[]>([])
const route = useRoute()

const currentPath = computed(() =>
  typeof route.params.path === 'string' ? route.params.path : '',
)

const isActiveBranch = computed(() =>
  currentPath.value === props.path || currentPath.value.startsWith(`${props.path}:`),
)

function baseName(f: string) {
  return f.replace(/\.[^/.]+$/, '')
}

function ext(f: string) {
  return f.match(/\.([^.]+)$/)?.[1] ?? ''
}

function childPath(child: string) {
  return props.path ? `${props.path}:${child}` : child
}

function editLink(file: string) {
  return `/admin/edit/${ext(file) === 'md' ? 'markdown' : 'file'}/${childPath(file)}`
}

async function loadContents() {
  if (files.value.length || dirs.value.length || isLoading.value) return
  isLoading.value = true
  const data = await $fetch('/api/admin/list', { query: { path: props.path } })
  if (data) {
    files.value = data.files
    dirs.value = data.dirs
  }
  isLoading.value = false
}

async function toggle() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) await loadContents()
}

watch(isActiveBranch, async (active) => {
  if (active) {
    isExpanded.value = true
    await loadContents()
  }
}, { immediate: true })
</script>

<template>
  <div class="tree-node">
    <button
      class="tree-folder file-item w-full text-left"
      :class="{ active: isActiveBranch }"
      @click="toggle"
    >
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="tree-chevron"
        :class="{ 'rotate-90': isExpanded }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>

    <div
      class="tree-collapse"
      :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div
          v-if="isLoading"
          class="tree-loading"
        >
          Laden...
        </div>
        <div
          v-else
          class="tree-children"
        >
          <NuxtLink
            v-for="file in files"
            :key="file"
            :to="editLink(file)"
            class="file-item"
            :class="{ active: currentPath === childPath(file) }"
          >
            <FileIcon :file-path="childPath(file)" />
            <span class="file-item-label">{{ baseName(file) }}</span>
            <span
              v-if="ext(file)"
              class="file-item-ext"
            >.{{ ext(file) }}</span>
          </NuxtLink>

          <TreeNode
            v-for="dir in dirs"
            :key="dir"
            :path="childPath(dir)"
            :name="dir"
          />
        </div>
      </div>
    </div>
  </div>
</template>
