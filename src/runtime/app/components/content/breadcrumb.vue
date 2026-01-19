<script setup lang="ts">
import { useRoute } from '#app'

const path = useRoute().params.path as string || ''
const parts = path.split(':').filter(part => part.length > 0)
parts.unshift('Hauptordner')
</script>

<template>
  <div class="text-gray-500 text-base mt-12 mb-6 flex items-center gap-1">
    <div
      v-for="(part, index) in parts"
      :key="index"
      class="flex items-center gap-1"
    >
      <svg
        v-if="index > 0"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
      <NuxtLink
        v-if="index < parts.length - 1"
        :to="`/admin/${index > 0 ? parts.slice(0, index + 1).join(':') : ''}`"
        class="button secondary small"
      >
        {{ part }}
      </NuxtLink>
      <span
        v-else
        style="font-weight: bold;"
      >
        {{ part }}
      </span>
    </div>
  </div>
</template>
