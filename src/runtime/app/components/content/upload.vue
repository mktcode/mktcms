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
  <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
    <h1 style="margin-bottom: 0;">
      Datei hochladen
    </h1>

    <div style="display: flex; gap: 16px; align-items: center;">
      <div style="flex-grow: 1;">
        <h3 style="margin-bottom: 4px;">
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
      <div style="flex-grow: 1;">
        <h3 style="margin-bottom: 4px;">
          Neuen Unterordner erstellen
        </h3>
        <input
          v-model="newSubdir"
          type="text"
          placeholder="Unterordner (z.B. 'Produkte')"
          @change="path = dir ? dir.replace(/\//g, ':') + ':' + newSubdir : newSubdir"
        >
      </div>
    </div>

    <button
      :disabled="isUploading"
      @click="fileInputImg?.click()"
    >
      Bild hochladen
    </button>
    <button
      :disabled="isUploading"
      @click="fileInputPdf?.click()"
    >
      PDF hochladen
    </button>
    <button
      :disabled="isUploading"
      @click="fileInput?.click()"
    >
      Andere Datei hochladen
    </button>
    <input
      ref="fileInput"
      style="display: none"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp,.md,.docx,.txt"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputImg"
      style="display: none"
      type="file"
      accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
      @change="async (e) => { await uploadFiles(e); }"
    >
    <input
      ref="fileInputPdf"
      style="display: none"
      type="file"
      accept=".pdf"
      @change="async (e) => { await uploadFiles(e); }"
    >
  </div>
</template>
