<script setup lang="ts">
const page = await $fetch('/api/pages/home');
const sections = await $fetch('/api/sections/list', { method: 'POST', body: { pageId: page.id } });
const sectionsWithComponent = sections.map((section) => {
  return {
    ...section,
    component: defineAsyncComponent(() => import(`~/components/website/section/${section.component}.vue`))
  }
});
</script>

<template>
  <component
    v-for="(section, index) in sectionsWithComponent"
    :is="section.component"
    :key="index"
    :contentId="section.contentId"
    :categoryId="section.categoryId"
  />
</template>
