<script setup lang="ts">
import { useFetch, useRoute } from '#app'

const path = useRoute().params.path as string || ''
const pathParts = path.split(':')

const { data: content } = await useFetch<string>(`/api/content/${path}`)
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
        style="width: 100%; resize: vertical;"
        v-model="content"
      ></textarea>
    </div>
  </div>
</template>
