<script setup lang="ts">
const { clear } = useUserSession();

const items = ref([
  [
    {
      icon: 'i-heroicons-home',
      to: '/',
    },
    {
      label: 'Werbung',
      icon: 'i-heroicons-megaphone',
      to: '/werbung',
    },
    {
      label: 'Buchhaltung',
      icon: 'i-heroicons-scale',
      to: '/buchhaltung',
    },
    {
      label: 'Nachrichten',
      icon: 'i-heroicons-chat-bubble-left-ellipsis',
      to: '/nachrichten',
      slot: 'contactFormMessages',
    }
  ],
  [
    {
      label: 'Hilfe',
      icon: 'i-heroicons-question-mark-circle',
      to: '/hilfe',
    },
    {
      label: 'Einstellungen',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/einstellungen',
    },
    {
      slot: 'auth',
      label: 'Abmelden',
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      onSelect: () => {
        clear();
        navigateTo('/');
      }
    }
  ]
]);
</script>

<template>
  <nav class="bg-white sticky top-0 z-[60] border-b border-gray-200 overflow-x-scroll">
    <UNavigationMenu
      color="primary"
      variant="pill"
      :items="items"
      class="mx-auto min-w-[49rem] max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <template #contactFormMessages-trailing>
        <UBadge color="primary" label="1" variant="outline" size="sm" />
      </template>
    </UNavigationMenu>
  </nav>
</template>