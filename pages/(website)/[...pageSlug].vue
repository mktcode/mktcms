<script setup lang="ts">
import type { Page } from '~/types';

const route = useRoute();
const pageSlug = Array.isArray(route.params.pageSlug) ? route.params.pageSlug : [route.params.pageSlug];
const page = await $fetch<Page>(`/api/pages/${pageSlug.join('/')}`);
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
