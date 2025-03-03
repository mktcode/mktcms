<script setup lang="ts">
defineProps<{
  title: string;
  enabled: boolean;
}>()
</script>

<template>
  <div class="flex space-x-4 border border-gray-200 rounded-lg p-4">
    <div>
      <svg v-if="enabled" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-green-600">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-yellow-600">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    </div>
    <div class="flex flex-col">
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        {{ title }}
      </h2>
      <p class="text-gray-600">
        <slot name="content-enabled" v-if="enabled" />
        <slot name="content-disabled" v-else />
      </p>
      <div class="flex ml-auto mt-4 space-x-2">
        <slot name="buttons-enabled" v-if="enabled" />
        <slot name="buttons-disabled" v-else />
      </div>
    </div>
  </div>
</template>