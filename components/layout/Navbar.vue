<script setup lang="ts">
import type { Project } from '~/types';

const { clear } = useUserSession();

const websiteButton = ref({
  label: 'Website öffnen',
  icon: 'i-heroicons-arrow-top-right-on-square',
  to: '',
  target: '_blank',
})

const items = ref([
  [
    {
      icon: 'i-heroicons-home',
      to: '/',
    },
    {
      label: 'Inhalte',
      icon: 'i-heroicons-newspaper',
      to: '/inhalte',
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
    websiteButton.value,
    {
      slot: 'auth',
      label: 'Abmelden',
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      onSelect: () => {
        clear();
        navigateTo('/login');
      }
    }
  ]
]);

const currentProject = ref<Project | null>(null);

onMounted(async () => {
  const projects = await $fetch('/api/projectList');
  if (projects.length === 0) {
    return;
  }
  
  currentProject.value = projects[0];
  websiteButton.value.to = `https://${currentProject.value.domain}`;
})
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