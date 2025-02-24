<script setup lang="ts">
const sections = await $fetch('/api/sections/list', { method: 'POST' });
const sectionsWithComponent = sections.map((section) => {
  return {
    ...section,
    component: defineAsyncComponent(() => import(`~/components/website/section/${section.component}.vue`))
  }
});
</script>

<template>
  <component :is="section.component" v-for="(section, index) in sectionsWithComponent" :key="index" :contentId="section.contentId" />
</template>
