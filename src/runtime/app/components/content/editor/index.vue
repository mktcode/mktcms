<script setup lang="ts">
import { useFetch, useRoute } from '#app'
import { ref, watch } from 'vue'
import Csv from './csv.vue'
import Markdown from './markdown.vue'

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
    <div class="breadcrumbs">
      <a href="/admin">Hauptverzeichnis</a>
      <span
        v-for="(part, index) in pathParts"
        :key="index"
      >
        /
        <a :href="`/admin/${pathParts.slice(0, index + 1).join(':')}`">
          {{ part }}
        </a>
      </span>
    </div>

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
        v-else-if="path.endsWith('.txt')"
        v-model="content"
        style="width: 100%; height: 400px; font-family: monospace; resize: vertical;"
      />
      <button
        style="margin-top: 10px;"
        @click="saveContent"
      >
        <span v-if="isSaving">Speichern...</span>
        <span v-else>Speichern</span>
      </button>
      <span v-if="savingSuccessful" style="color: green; margin-left: 10px;">✔️ Gespeichert</span>
    </div>
  </div>
</template>
