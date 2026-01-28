<script setup lang="ts">
import { onMounted, ref, useFetch, useRoute } from '#imports'
import useAdminUpload from '../../composables/useAdminUpload'

const { data: list } = await useFetch('/api/admin/list')

const route = useRoute()
const dir = ref(route.query.dir as string || '')

const newSubdir = ref('')

const { isUploading, fileInput, fileInputImg, fileInputPdf, path, uploadFiles } = useAdminUpload()

onMounted(() => {
  path.value = dir.value
})
</script>

<template>
  <div class="flex flex-col gap-2 my-4">
    <h1 class="my-6">
      Datei hochladen
    </h1>

    <div class="bg-emerald-50 text-emerald-800 p-4 rounded flex gap-4 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-10 opacity-50"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      Wenn eine Datei mit gleichem Namen im ausgewählten Ordner bereits existiert, wird diese
      überschrieben!
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
            v-for="d in list?.dirs"
            :key="d"
            :value="d"
          >
            {{ d }}
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
      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.md,.docx,.txt,.csv,.json"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputImg"
      class="hidden"
      type="file"
      accept=".jpg,.jpeg,.png,.gif,.webp"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputPdf"
      class="hidden"
      type="file"
      accept=".pdf"
      @change="async (e) => { await uploadFiles(e); }"
    >
  </div>
</template>
