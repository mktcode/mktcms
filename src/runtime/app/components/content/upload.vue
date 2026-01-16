<script setup lang="ts">
import { onMounted, ref, useRoute } from '#imports';
import useAdminUpload from '../../composables/useAdminUpload'

const route = useRoute()
const dir = ref(route.query.dir as string || '')

const { isUploading, fileInput, fileInputImg, fileInputPdf, path, uploadFiles } = useAdminUpload()

onMounted(() => {
  path.value = dir.value
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
    <h1>
      Datei hochladen
    </h1>
    <h2 style="margin: 0;">
      Ordner
    </h2>
    <input
      v-model="path"
      type="text"
      placeholder="Unterordner (z.B. 'Produkte')"
    >
    <button
      :disabled="isUploading"
      @click="fileInputImg?.click()"
    >
      Bild auswählen
    </button>
    <button
      :disabled="isUploading"
      @click="fileInputPdf?.click()"
    >
      PDF auswählen
    </button>
    <button
      :disabled="isUploading"
      @click="fileInput?.click()"
    >
      Andere Datei auswählen
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
