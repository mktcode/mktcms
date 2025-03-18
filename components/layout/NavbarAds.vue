<script setup lang="ts">
const items = ref([
  {
    label: 'Texte & Bilder',
    icon: 'i-heroicons-newspaper',
    to: '/werbung/inhalte',
  },
  {
    label: 'Website',
    icon: 'i-heroicons-computer-desktop',
    to: '/werbung/website',
  },
  {
    label: 'Google',
    icon: 'i-fa-google',
    to: '/werbung/google',
  },
  {
    label: 'Print',
    icon: 'i-heroicons-map',
    to: '/werbung/print',
  },
])
</script>

<template>
  <div class="bg-white border-b border-gray-200 overflow-x-scroll">
    <div class="mx-auto min-w-[38rem] max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-4 items-center justify-between">
      <UNavigationMenu color="primary" variant="pill" :items="items" />
      <slot />
    </div>
  </div>
</template>
