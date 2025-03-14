<script setup lang="ts">
const { clear, user } = useUserSession();

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
    }
  ],
  [
    {
      icon: 'i-heroicons-question-mark-circle',
      to: '/hilfe',
    },
    {
      icon: 'i-heroicons-cog-6-tooth',
      to: '/einstellungen',
    },
    {
      label: 'Website öffnen',
      to: `https://${user.value?.domain}`,
      target: '_blank',
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
  <nav class="bg-white sticky top-0 z-[60] border-b border-gray-200">
    <UNavigationMenu
      color="primary"
      variant="pill"
      :items="items"
      class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    />
  </nav>
</template>