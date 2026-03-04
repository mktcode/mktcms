<script setup lang="ts">
import { onMounted, ref, useRoute } from '#imports'
import useAdminUpload from '../../composables/useAdminUpload'
import { CONTENT_UPLOAD_EXTENSIONS, IMAGE_EXTENSIONS, PDF_EXTENSIONS, toAcceptAttribute } from '../../../shared/contentFiles'

const route = useRoute()
const dir = ref(route.query.dir as string || '')
const dirs = ref<string[]>([])

const newSubdir = ref('')

const uploadAccept = toAcceptAttribute(CONTENT_UPLOAD_EXTENSIONS)
const imageAccept = toAcceptAttribute(IMAGE_EXTENSIONS)
const pdfAccept = toAcceptAttribute(PDF_EXTENSIONS)

const { isUploading, fileInput, fileInputImg, fileInputPdf, path, uploadFiles } = useAdminUpload()

const loadAllDirs = async () => {
  const found = new Set<string>()
  const queue: string[] = ['']

  while (queue.length > 0) {
    const currentPath = queue.shift()
    if (currentPath === undefined) {
      continue
    }

    const list = await $fetch<{ dirs: string[] }>('/api/admin/list', {
      query: currentPath ? { path: currentPath } : {},
    })

    for (const childDir of list.dirs) {
      const fullPath = currentPath ? `${currentPath}:${childDir}` : childDir
      if (found.has(fullPath)) {
        continue
      }
      found.add(fullPath)
      queue.push(fullPath)
    }
  }

  dirs.value = [...found].sort((a, b) => a.localeCompare(b, 'de'))
}

await loadAllDirs()

onMounted(() => {
  path.value = dir.value
})
</script>

<template>
  <div class="flex flex-col gap-2 my-4">
    <h1 class="mb-6">
      Datei hochladen
    </h1>

    <div class="bg-lime-50 text-lime-800 p-4 rounded flex gap-4 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-8 opacity-30 shrink-0"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      Wenn eine Datei mit gleichem Namen im ausgewählten Ordner bereits existiert, wird diese
      überschrieben. Alle Dateien werden allerdings in einer permanenten Historie gespeichert, sodass vorherige Versionen wiederhergestellt werden können.
    </div>

    <div class="flex gap-4 items-center">
      <div class="flex-1">
        <h3 class="mb-1">
          Ordner
        </h3>
        <select
          v-model="dir"
          @change="path = dir"
        >
          <option value="">
            Hauptordner
          </option>
          <option
            v-for="d in dirs"
            :key="d"
            :value="d"
          >
            {{ d.replace(/:/g, ' / ') }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <h3 class="mb-1">
          Unterordner erstellen
        </h3>
        <input
          v-model="newSubdir"
          type="text"
          placeholder="z.B. Produkte"
          @change="path = dir ? dir.replace(/\//g, ':') + ':' + newSubdir : newSubdir"
        >
      </div>
    </div>

    <button
      type="button"
      class="button"
      :disabled="isUploading"
      @click="fileInputImg?.click()"
    >
      Bild hochladen
    </button>
    <button
      type="button"
      class="button"
      :disabled="isUploading"
      @click="fileInputPdf?.click()"
    >
      PDF hochladen
    </button>
    <button
      type="button"
      class="button"
      :disabled="isUploading"
      @click="fileInput?.click()"
    >
      Andere Datei hochladen
    </button>
    <input
      ref="fileInput"
      class="hidden"
      type="file"
      :accept="uploadAccept"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputImg"
      class="hidden"
      type="file"
      :accept="imageAccept"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputPdf"
      class="hidden"
      type="file"
      :accept="pdfAccept"
      @change="async (e) => { await uploadFiles(e); }"
    >
  </div>
</template>
