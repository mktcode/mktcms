<script setup lang="ts">
import { ref } from 'vue'
import Saved from '../saved.vue'
import usePathParam from '../../../composables/usePathParam'
import { useFetch } from '#imports'
import FrontmatterForm from './frontmatter/form.vue'

const { path } = usePathParam()
const { data: content } = await useFetch<{ frontmatter: Record<string, any>, markdown: string }>(`/api/admin/md?path=${path}`)

const frontmatter = ref<Record<string, any>>(content.value?.frontmatter ?? {})
const markdown = ref<string>(content.value?.markdown ?? '')

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

const mode = ref<'edit' | 'preview'>('edit')
</script>

<template>
  <div v-if="content">
    <FrontmatterForm v-model:frontmatter="frontmatter" />
    <div class="flex gap-2 my-2">
      <button
        type="button"
        class="button secondary flex-1"
        :disabled="mode === 'edit'"
        @click="mode = 'edit'"
      >
        Bearbeiten
      </button>
      <button
        type="button"
        class="button secondary flex-1"
        :disabled="mode === 'preview'"
        @click="mode = 'preview'"
      >
        Vorschau
      </button>
    </div>

    <textarea
      v-if="mode === 'edit'"
      v-model="markdown"
      class="w-full min-h-72"
    />

    <MDC
      v-else
      class="prose max-w-full min-h-72 border border-gray-200 rounded-sm p-4"
      :value="markdown"
    />

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
</template>
