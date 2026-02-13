<script setup lang="ts">
import { ref } from 'vue'
import { refDebounced } from '@vueuse/core'
import Saved from '../saved.vue'
import usePathParam from '../../../composables/usePathParam'
import { useFetch } from '#imports'
import FrontmatterForm from './frontmatter/form.vue'
import MonacoEditor from './monacoEditor.vue'

const { path } = usePathParam()
const { data: content } = await useFetch<{ frontmatter: Record<string, any>, markdown: string }>(`/api/admin/md?path=${path}`)

const frontmatter = ref<Record<string, any>>(content.value?.frontmatter ?? {})
const markdown = ref<string>(content.value?.markdown ?? '')

const debouncedMarkdown = refDebounced(markdown, 250)

const isSaving = ref(false)
const savingSuccessful = ref(false)

async function saveMarkdown() {
  if (!content.value) return

  isSaving.value = true
  savingSuccessful.value = false

  await useFetch(`/api/admin/md?path=${path}`, {
    method: 'POST',
    body: {
      frontmatter: frontmatter.value,
      markdown: markdown.value,
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
    <FrontmatterForm
      v-model:frontmatter="frontmatter"
      class="mb-2"
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
      <button
        type="button"
        class="button w-full justify-center mt-3"
        @click="saveMarkdown"
      >
        <span v-if="isSaving">Speichern...</span>
        <span v-else>Speichern</span>
      </button>
      <Saved v-if="savingSuccessful" />
    </div>
  </div>
</template>
