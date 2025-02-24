<script setup lang="ts">
const route = useRoute();
const categorySlug = Array.isArray(route.params.categorySlug) ? route.params.categorySlug[0] : route.params.categorySlug;

const sections = await $fetch('/api/sections/list', { method: 'POST', body: { categoryId: categorySlug } });
const sectionComponents = sections.map((section) => defineAsyncComponent(() => import(`~/components/website/section/${section.component}.vue`)));
</script>

<template>
  <component :is="section" v-for="(section, index) in sectionComponents" :key="index" :contentId="1" />
</template>
