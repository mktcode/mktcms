<script setup lang="ts">
import { ref } from 'vue'
import { refDebounced } from '@vueuse/core'
import Saved from '../saved.vue'
import usePathParam from '../../../composables/usePathParam'
import useCopyMode from '../../../composables/useCopyMode'
import { navigateTo, useFetch } from '#imports'
import FrontmatterModal from './frontmatter/modal.vue'
import MonacoEditor from './monacoEditor.vue'

const { path } = usePathParam()
const { isCopyMode, newFilename, sourceExtension, targetPath, targetEditPath, filenameError, confirmOverwriteIfNeeded } = useCopyMode(path)
const { data: content } = await useFetch<{ frontmatter: Record<string, any>, markdown: string }>(`/api/admin/md?path=${path}`)

const frontmatter = ref<Record<string, any>>(content.value?.frontmatter ?? {})
const markdown = ref<string>(content.value?.markdown ?? '')
const commitMessage = ref<string>('Inhaltliche Änderungen')

const debouncedMarkdown = refDebounced(markdown, 250)

const isSaving = ref(false)
const savingSuccessful = ref(false)
const showFrontmatterModal = ref(false)

async function saveMarkdown() {
  if (!content.value) return
  if (isCopyMode.value && !await confirmOverwriteIfNeeded()) return

  isSaving.value = true
  savingSuccessful.value = false

  await useFetch(`/api/admin/md?path=${isCopyMode.value ? targetPath.value : path}`, {
    method: 'POST',
    body: {
      frontmatter: frontmatter.value,
      markdown: markdown.value,
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

const mode = ref<'edit' | 'preview'>('preview')
</script>

<template>
  <div
    v-if="content"
    class="flex-1 min-h-0 flex flex-col"
  >
    <button
      type="button"
      class="button secondary small mb-3 self-start"
      @click="showFrontmatterModal = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
      Einstellungen
    </button>

    <FrontmatterModal
      v-model:frontmatter="frontmatter"
      :is-open="showFrontmatterModal"
      @close="showFrontmatterModal = false"
    />

    <div class="flex gap-2 my-2 lg:hidden">
      <button
        type="button"
        class="button secondary flex-1"
        :disabled="mode === 'preview'"
        @click="mode = 'preview'"
      >
        Vorschau
      </button>
      <button
        type="button"
        class="button secondary flex-1"
        :disabled="mode === 'edit'"
        @click="mode = 'edit'"
      >
        Bearbeiten
      </button>
    </div>

    <div class="flex-1 min-h-0 overflow-hidden">
      <div class="h-full min-h-0 overflow-hidden flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
        <div
          class="flex-1 min-h-0 h-full lg:block"
          :class="mode === 'edit' ? 'block' : 'hidden'"
        >
          <ClientOnly>
            <MonacoEditor
              v-model="markdown"
              language="markdown"
              class="w-full h-full min-h-0 border border-gray-200 rounded-sm"
            />
          </ClientOnly>
        </div>

        <div
          class="flex-1 min-h-0 overflow-auto border border-gray-200 rounded-sm p-4 lg:block lg:h-full"
          :class="mode === 'preview' ? 'block' : 'hidden'"
        >
          <MDC
            :value="debouncedMarkdown"
            class="prose prose-sm max-w-none"
          />
        </div>
      </div>
    </div>

    <div class="flex-none">
      <div
        v-if="isCopyMode"
        class="mt-3"
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
        @click="saveMarkdown"
      >
        <span v-if="isSaving">Speichern...</span>
        <span v-else>{{ isCopyMode ? 'Neue Datei veröffentlichen' : 'Speichern' }}</span>
      </button>
      <Saved v-if="savingSuccessful" />
    </div>
  </div>
</template>
