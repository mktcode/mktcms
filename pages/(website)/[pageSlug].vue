<script setup lang="ts">
const route = useRoute();
const pageSlug = Array.isArray(route.params.pageSlug) ? route.params.pageSlug[0] : route.params.pageSlug;

const sections = await $fetch('/api/sections/list', { method: 'POST', body: { route: pageSlug } });
const sectionComponents = sections.map((section) => defineAsyncComponent(() => import(`~/components/website/section/${section.component}.vue`)));
</script>

<template>
  <component :is="section" v-for="(section, index) in sectionComponents" :key="index" />
</template>
