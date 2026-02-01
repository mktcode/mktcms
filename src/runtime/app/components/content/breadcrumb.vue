<script setup lang="ts">
import { useRoute } from '#app'

const path = useRoute().params.path as string || ''
const parts = path.split(':').filter(part => part.length > 0)
parts.unshift('home')
</script>

<template>
  <div
    class="text-gray-500 text-base flex items-center gap-1"
    :class="{ 'mb-4': parts.length > 1 }"
  >
    <div
      v-for="(part, index) in parts"
      :key="index"
      class="flex items-center gap-1"
    >
      <svg
        v-if="index > 0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
      <NuxtLink
        v-if="index < parts.length - 1"
        :to="`/admin/${index > 0 ? parts.slice(1, index + 1).join(':') : ''}`"
        class="button secondary small"
      >
        <template v-if="index == 0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </template>
        <template v-else>
          {{ part }}
        </template>
      </NuxtLink>
      <span
        v-else-if="index != 0"
        style="font-weight: bold;"
      >
        {{ part }}
      </span>
    </div>
  </div>
</template>
