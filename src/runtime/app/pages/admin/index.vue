<script setup lang="ts">
import { useFetch } from '#app';
import Admin from '../../components/admin.vue'
import useAdminUpload from '../../composables/useAdminUpload';

const { data: keys, refresh } = await useFetch('/api/content/list')
const { isUploading, fileInput, path, uploadFiles } = useAdminUpload()
</script>

<template>
  <Admin>
    <h1>Admin Dashboard</h1>
    <a href="/api/admin/logout">Abmelden</a>

    <div>
      <input
        v-model="path"
        type="text"
        placeholder="Unterordner (z.B. 'Produkte')"
      />
      <button :disabled="isUploading">
        Neuer Inhalt
      </button>
      <button
        @click="fileInput?.click()"
        :disabled="isUploading"
      >
        Bild/Dokument hochladen
      </button>
      <input
        ref="fileInput"
        style="display: none"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp,.md,.docx,.txt"
        @change="async (e) => { await uploadFiles(e); await refresh(); }"
      />
    </div>

    <div>
      <div v-for="key in keys" :key="key">
        <h2>{{ key }}</h2>
      </div>
    </div>
  </Admin>
</template>