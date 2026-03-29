<script setup lang="ts">
import { useFetch } from '#app'
import TreeNode from './treeNode.vue'
import FileIcon from './fileIcon.vue'

const { data: list } = await useFetch('/api/admin/list', {
  query: { path: '' },
})

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
      style="color: var(--color-ds-on-surface-variant);"
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
      <span class="file-item-label">Datei hochladen</span>
    </NuxtLink>

    <div
      v-if="list && (list.files.length > 0 || list.dirs.length > 0)"
      class="flex flex-col gap-0.5 mt-1"
    >
      <!-- Root level files -->
      <div
        v-for="file in list.files"
        :key="file"
        class="flex items-center gap-1"
      >
        <NuxtLink
          :to="`/admin/edit/${fileExtension(file) === 'md' ? 'markdown/' : 'file/'}${file}`"
          class="file-item flex-1"
        >
          <FileIcon :file-path="file" />
          <span class="file-item-label">{{ filenameWithoutExtension(file) }}</span>
          <span
            v-if="fileExtension(file)"
            class="file-item-ext"
          >.{{ fileExtension(file) }}</span>
        </NuxtLink>
      </div>

      <!-- Root level directories - collapsible -->
      <TreeNode
        v-for="dir in list.dirs"
        :key="dir"
        :path="dir"
        :name="dir"
        :is-directory="true"
        :level="0"
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
