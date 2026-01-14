<script setup lang="ts">
import { useFetch, useRoute } from '#app'

const path = useRoute().params.path as string || ''
const pathParts = path.split(':')

const { data: content } = await useFetch<string>(`/api/content/${path}`)

async function saveContent() {
  await $fetch(`/api/admin/content/${path}`, {
    method: 'POST',
    body: { content: content.value },
  })
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
      <textarea
        v-model="content"
        style="width: 100%; resize: vertical;"
      />
      <button
        style="margin-top: 10px;"
        @click="saveContent"
      >
        Speichern
      </button>
    </div>
  </div>
</template>
