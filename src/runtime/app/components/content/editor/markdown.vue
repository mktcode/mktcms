<script setup lang="ts">
import { ref } from 'vue'
import { refDebounced } from '@vueuse/core'
import Saved from '../saved.vue'
import usePathParam from '../../../composables/usePathParam'
import { useFetch } from '#imports'
import FrontmatterModal from './frontmatter/modal.vue'
import MonacoEditor from './monacoEditor.vue'

const { path } = usePathParam()
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

  isSaving.value = true
  savingSuccessful.value = false

  await useFetch(`/api/admin/md?path=${path}`, {
    method: 'POST',
    body: {
      frontmatter: frontmatter.value,
      markdown: markdown.value,
      commitMessage: commitMessage.value,
    },
  })

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
      Metadaten bearbeiten
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
        :disabled="!commitMessage.trim() || isSaving"
        @click="saveMarkdown"
      >
        <span v-if="isSaving">Speichern...</span>
        <span v-else>Speichern</span>
      </button>
      <Saved v-if="savingSuccessful" />
    </div>
  </div>
</template>
