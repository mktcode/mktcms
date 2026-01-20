<script setup lang="ts">
import Saved from '../saved.vue'
import usePathParam from '../../../composables/usePathParam'
import { ref, useFetch } from '#imports'

const { path } = usePathParam()
const { data: content } = await useFetch<string>(`/api/admin/txt?path=${path}`)

const isSaving = ref(false)
const savingSuccessful = ref(false)

async function saveContent() {
  if (content.value === undefined) return

  isSaving.value = true
  savingSuccessful.value = false

  await useFetch(`/api/admin/txt?path=${path}`, {
    method: 'POST',
    body: {
      text: content.value,
    },
  })

  isSaving.value = false
  savingSuccessful.value = true
}
</script>

<template>
  <div>
    <textarea
      v-model="content"
      class="w-full h-24 resize-y border border-gray-300 p-2 box-border font-mono"
    />

    <button
      type="button"
      class="button w-full justify-center mt-3"
      @click="saveContent"
    >
      <span v-if="isSaving">Speichern...</span>
      <span v-else>Speichern</span>
    </button>
    <Saved v-if="savingSuccessful" />
  </div>
</template>
