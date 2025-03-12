<script setup lang="ts">
const items = ref([
  [
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
      icon: 'i-lucide-box',
      to: '/buchhaltung/rechnungen/posten',
    }
  ],
])
</script>

<template>
  <div class="border-b border-gray-200">
    <UNavigationMenu color="neutral" variant="link" :items="items" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
  </div>
</template>
