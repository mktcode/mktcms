<script setup lang="ts">
const items = ref([
  {
    label: 'Kontakt',
    icon: 'i-heroicons-phone',
    to: '/hilfe',
  },
  {
    label: 'Chat',
    icon: 'i-heroicons-chat-bubble-left-right',
    slot: 'chat',
    disabled: true,
  },
])
</script>

<template>
  <div class="bg-white border-b border-gray-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-4 items-center justify-between">
      <UNavigationMenu color="primary" variant="pill" :items="items">
        <template #chat-trailing>
          <UBadge color="primary" label="Kommt bald" variant="outline" size="sm" />
        </template>
      </UNavigationMenu>
      <slot />
    </div>
  </div>
</template>
