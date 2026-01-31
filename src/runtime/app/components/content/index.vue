<script setup lang="ts">
import { useFetch } from '#app'
import Files from './files.vue'
import Dirs from './dirs.vue'
import usePathParam from '../../composables/usePathParam'
import useImport from '../../composables/useImport'

const { path } = usePathParam()

const { data: list, refresh } = await useFetch('/api/admin/list', {
  query: { path },
})

const { fileInput, uploadFile } = useImport()
</script>

<template>
  <div>
    <NuxtLink
      :to="path ? `/admin/new?dir=${encodeURIComponent(path)}` : '/admin/new'"
      class="button secondary w-full flex items-center border border-dashed!"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Datei hochladen
    </NuxtLink>

    <hr class="my-4 border-gray-200" />

    <Files
      v-if="list && list.files.length"
      :files="list.files"
    />

    <hr class="my-4 border-gray-200" v-if="list && list.files.length && list.dirs.length" />

    <Dirs
      v-if="list && list.dirs.length"
      :dirs="list.dirs"
      style="margin-top: 8px;"
    />

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
