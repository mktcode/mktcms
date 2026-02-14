<script setup lang="ts">
import { useFetch } from '#app'
import TreeNode from './treeNode.vue'
import FileIcon from './fileIcon.vue'
import FileButtons from './fileButtons.vue'
import useImport from '../../composables/useImport'

const { data: list, refresh } = await useFetch('/api/admin/list', {
  query: { path: '' },
})

const { fileInput, uploadFile } = useImport()

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
      class="button secondary w-full flex items-center border border-dashed!"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      Datei hochladen
    </NuxtLink>

    <hr class="my-4 border-gray-200">

    <div v-if="list && (list.files.length > 0 || list.dirs.length > 0)" class="space-y-2">
      <!-- Root level files -->
      <div
        v-for="file in list.files"
        :key="file"
        class="flex gap-2"
      >
        <NuxtLink
          :to="`/admin/edit/${fileExtension(file) === 'md' ? 'markdown/' : 'file/'}${file}`"
          class="flex-1 button secondary"
        >
          <FileIcon :file-path="file" />
          <div class="w-full flex">
            {{ filenameWithoutExtension(file) }}
            <span
              v-if="fileExtension(file)"
              class="text-sm text-gray-400 ml-auto"
            >
              .{{ fileExtension(file) }}
            </span>
          </div>
        </NuxtLink>
        <FileButtons :file-path="file" />
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
      class="flex flex-col gap-4"
    >
      <p>Keine Dateien oder Verzeichnisse gefunden.</p>
      <button
        class="button"
        @click="fileInput?.click()"
      >
        Dateien importieren
      </button>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".zip"
        @change="async (e) => { await uploadFile(e); await refresh(); }"
      >
    </div>
  </div>
</template>
