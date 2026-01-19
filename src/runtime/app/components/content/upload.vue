<script setup lang="ts">
import { computed, onMounted, ref, useFetch, useRoute } from '#imports'
import useAdminUpload from '../../composables/useAdminUpload'

const { data: keys } = await useFetch('/api/admin/content/list')

const dirs = computed(() => {
  const dirSet = new Set<string>()
  keys.value?.forEach((key: string) => {
    const parts = key.split(':')
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i++) {
        const dir = parts.slice(0, i + 1).join('/')
        dirSet.add(dir)
      }
    }
  })
  return Array.from(dirSet).sort()
})

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
      accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp,.md,.docx,.txt"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputImg"
      class="hidden"
      type="file"
      accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
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
