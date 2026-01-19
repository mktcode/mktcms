<script setup lang="ts">
import { useFetch, useRoute } from '#app'
import { ref, watch } from 'vue'
import Csv from './csv.vue'
import Markdown from './markdown.vue'
import Breadcrumb from '../../breadcrumb.vue'

const path = useRoute().params.path as string || ''
const pathParts = path.split(':')

const { data: content } = await useFetch<string>(`/api/admin/content/${path}`)

const isSaving = ref(false)
const savingSuccessful = ref(false)

watch(content, () => {
  savingSuccessful.value = false
})

async function saveContent() {
  isSaving.value = true
  savingSuccessful.value = false

  await $fetch(`/api/admin/content/${path}`, {
    method: 'POST',
    body: { content: content.value },
  })

  isSaving.value = false
  savingSuccessful.value = true
}
</script>

<template>
  <div>
    <Breadcrumb :parts="pathParts" />

    <div v-if="content !== undefined">
      <Markdown
        v-if="path.endsWith('.md')"
        v-model:content="content"
      />
      <Csv
        v-else-if="path.endsWith('.csv')"
        v-model:content="content"
      />
      <textarea
        v-if="path.match(/\.(txt|json)$/i)"
        v-model="content"
        style="width: 100%; height: 400px; font-family: monospace; resize: vertical;"
      />
      <button
        type="button"
        class="button mt-2.5"
        @click="saveContent"
      >
        <span v-if="isSaving">Speichern...</span>
        <span v-else>Speichern</span>
      </button>
      <span
        v-if="savingSuccessful"
        class="ml-2.5 text-emerald-700"
      >✔️ Gespeichert</span>
    </div>
  </div>
</template>
