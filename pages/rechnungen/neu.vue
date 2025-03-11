<script setup lang="ts">
import type { Project } from '~/types';

const currentProject = ref<Project | null>(null);

onMounted(async () => {
  const projects = await $fetch('/api/projectList');
  if (projects.length === 0) {
    return;
  }
  
  currentProject.value = projects[0];
})
</script>

<template>
  <div>
    <InvoicesForm v-if="currentProject" :project="currentProject" />
    <div v-else>
      Kein Projekt
    </div>
  </div>
</template>