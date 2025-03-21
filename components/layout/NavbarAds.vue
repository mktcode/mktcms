<script setup lang="ts">
const items = ref([
  {
    label: 'Website',
    icon: 'i-heroicons-computer-desktop',
    to: '/werbung/website',
  },
  {
    label: 'Print',
    icon: 'i-heroicons-map',
    to: '/werbung/print',
  },
  {
    label: 'Dateien',
    icon: 'i-heroicons-photo',
    to: '/werbung/dateien',
  },
  {
    label: 'Google',
    icon: 'i-fa-google',
    disabled: true,
  },
])
</script>

<template>
  <div class="bg-white border-b border-gray-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-4 items-center justify-between">
      <UNavigationMenu color="primary" variant="pill" :items="items" />
      <slot />
    </div>
  </div>
</template>
