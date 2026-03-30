<script setup lang="ts">
import { computed } from 'vue'
import { useFetch, useRoute } from '#app'
import FileButtons from './fileButtons.vue'
import FileIcon from './fileIcon.vue'
import TreeNode from './treeNode.vue'

const { data: list } = await useFetch('/api/admin/list', {
  query: { path: '' },
})

const route = useRoute()

const currentPath = computed(() => {
  return typeof route.params.path === 'string' ? route.params.path : ''
})

const isNewRoute = computed(() => route.path === '/admin/new')

function isActiveFile(path: string) {
  return currentPath.value === path
}

function filenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function fileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/)
  return match && match[1] ? match[1] : ''
}
</script>

<template>
  <div>
    <NuxtLink
      to="/admin/new"
      class="file-item"
      :class="{ active: isNewRoute }"
      :style="!isNewRoute ? 'color: var(--color-ds-on-surface-variant);' : undefined"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="file-item-icon"
        style="opacity: 0.5;"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      Datei hochladen
    </NuxtLink>

    <div
      v-if="list && (list.files.length > 0 || list.dirs.length > 0)"
      class="flex flex-col gap-0.5 mt-1"
    >
      <!-- Root level files -->
      <div
        v-for="file in list.files"
        :key="file"
        class="group/fi flex items-center gap-0.5"
      >
        <NuxtLink
          :to="`/admin/edit/${fileExtension(file) === 'md' ? 'markdown/' : 'file/'}${file}`"
          class="file-item flex-1 min-w-0"
          :class="{ active: isActiveFile(file) }"
        >
          <FileIcon :file-path="file" />
          <span class="file-item-label">
            {{ filenameWithoutExtension(file) }}
            <span
              v-if="fileExtension(file)"
              class="file-item-ext"
            >.{{ fileExtension(file) }}</span>
          </span>
        </NuxtLink>
        <FileButtons
          :file-path="file"
          class="shrink-0 opacity-0 group-hover/fi:opacity-100 transition-opacity duration-150"
        />
      </div>

      <!-- Root level directories - collapsible -->
      <TreeNode
        v-for="dir in list.dirs"
        :key="dir"
        :path="dir"
        :name="dir"
      />
    </div>

    <div
      v-if="list?.files.length === 0 && list.dirs.length === 0"
      class="flex flex-col gap-4 py-4"
    >
      <p
        class="text-sm"
        style="color: var(--color-ds-on-surface-variant);"
      >
        Keine Dateien oder Verzeichnisse gefunden.
      </p>
      <NuxtLink
        to="/admin/new"
        class="button small"
      >
        Datei hochladen
      </NuxtLink>
    </div>
  </div>
</template>
