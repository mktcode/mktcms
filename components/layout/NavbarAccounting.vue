<script setup lang="ts">
const items = ref([
  {
    label: 'Kunden',
    icon: 'i-heroicons-user-group',
    to: '/buchhaltung/kunden',
  },
  {
    label: 'Lieferanten',
    icon: 'i-heroicons-truck',
    to: '/buchhaltung/lieferanten',
  },
  {
    label: 'Ausgaben',
    icon: 'i-heroicons-arrow-up-tray',
    to: '/buchhaltung/rechnungen/eingehend',
  },
  {
    label: 'Einnahmen',
    icon: 'i-heroicons-arrow-down-tray',
    to: '/buchhaltung/rechnungen/ausgehend',
  },
  {
    label: 'Artikel',
    icon: 'i-heroicons-list-bullet',
    to: '/buchhaltung/rechnungen/artikel',
  }
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
