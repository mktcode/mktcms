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
    <Files
      v-if="list && list.files.length"
      :files="list.files"
    />

    <Dirs
      v-if="list && list.dirs.length"
      :dirs="list.dirs"
      style="margin-top: 8px;"
    />

    <div v-if="list?.files.length === 0 && list.dirs.length === 0" class="flex flex-col gap-4">
      <p>Keine Dateien oder Verzeichnisse gefunden.</p>
      <button class="button" @click="fileInput?.click()">
        Dateien importieren
      </button>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept=".zip"
        @change="async (e) => { await uploadFile(e); await refresh(); }"
      />
    </div>
  </div>
</template>
