<script setup lang="ts">
const items = ref([
  {
    label: 'Firma',
    icon: 'i-heroicons-building-storefront',
    to: '/einstellungen/firma',
  },
  {
    label: 'Domains',
    icon: 'i-heroicons-globe-alt',
    to: '/einstellungen/domains',
  },
  {
    label: 'E-Mail',
    icon: 'i-heroicons-envelope',
    to: '/einstellungen/email',
  },
  {
    label: 'Guthaben',
    icon: 'i-hugeicons-savings',
    to: '/einstellungen/guthaben',
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
