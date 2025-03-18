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
    label: 'Eingehend',
    icon: 'i-heroicons-arrow-down-tray',
    to: '/buchhaltung/rechnungen/eingehend',
  },
  {
    label: 'Ausgehend',
    icon: 'i-heroicons-arrow-up-tray',
    to: '/buchhaltung/rechnungen/ausgehend',
  },
  {
    label: 'Posten',
    icon: 'i-heroicons-list-bullet',
    to: '/buchhaltung/rechnungen/posten',
  }
])
</script>

<template>
  <div class="bg-white border-b border-gray-200 overflow-x-scroll">
    <div class="mx-auto min-w-[45rem] max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-4 items-center justify-between">
      <UNavigationMenu color="primary" variant="pill" :items="items" />
      <slot />
    </div>
  </div>
</template>
