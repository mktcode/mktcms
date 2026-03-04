<script setup lang="ts">
import Saved from '../saved.vue'
import usePathParam from '../../../composables/usePathParam'
import useCopyMode from '../../../composables/useCopyMode'
import { navigateTo, ref, useFetch } from '#imports'

const { path } = usePathParam()
const { isCopyMode, newFilename, sourceExtension, targetPath, targetEditPath, filenameError, confirmOverwriteIfNeeded } = useCopyMode(path)
const { data: content } = await useFetch<string>(`/api/admin/txt?path=${path}`)

const isSaving = ref(false)
const savingSuccessful = ref(false)
const commitMessage = ref<string>('Inhaltliche Änderungen')

async function saveContent() {
  if (content.value === undefined) return
  if (isCopyMode.value && !await confirmOverwriteIfNeeded()) return

  isSaving.value = true
  savingSuccessful.value = false

  await useFetch(`/api/admin/txt?path=${isCopyMode.value ? targetPath.value : path}`, {
    method: 'POST',
    body: {
      text: content.value,
      commitMessage: commitMessage.value,
    },
  })

  if (isCopyMode.value) {
    await navigateTo(targetEditPath.value, { replace: true })
    return
  }

  isSaving.value = false
  savingSuccessful.value = true
}
</script>

<template>
  <div>
    <div
      v-if="isCopyMode"
      class="mb-3"
    >
      <label
        for="copy-filename"
        class="block mb-1"
      >
        Neuer Dateiname
      </label>
      <div class="flex items-center gap-2">
        <input
          id="copy-filename"
          v-model="newFilename"
          type="text"
          required
          class="w-full border border-gray-200 rounded-sm px-3 py-2"
        >
        <span class="text-sm text-gray-400">{{ sourceExtension }}</span>
      </div>
      <p
        v-if="filenameError"
        class="text-sm mt-1"
      >
        {{ filenameError }}
      </p>
    </div>

    <textarea
      v-model="content"
      class="w-full h-24 resize-y border border-gray-300 p-2 box-border font-mono"
    />

    <div class="mt-3">
      <label
        for="commit-message"
        class="block mb-1"
      >
        Kommentar / Änderungsgrund
      </label>
      <input
        id="commit-message"
        v-model="commitMessage"
        type="text"
        required
        class="w-full border border-gray-200 rounded-sm px-3 py-2"
        placeholder="Inhaltliche Änderungen"
      >
    </div>

    <button
      type="button"
      class="button w-full justify-center mt-3"
      :disabled="!commitMessage.trim() || isSaving || !!filenameError"
      @click="saveContent"
    >
      <span v-if="isSaving">Speichern...</span>
      <span v-else>{{ isCopyMode ? 'Kopie speichern und veröffentlichen' : 'Speichern' }}</span>
    </button>
    <Saved v-if="savingSuccessful" />
  </div>
</template>
