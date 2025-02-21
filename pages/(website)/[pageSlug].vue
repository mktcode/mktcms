<script setup lang="ts">
const route = useRoute();
const pageSlug = Array.isArray(route.params.pageSlug) ? route.params.pageSlug[0] : route.params.pageSlug;
const sectionComponents = await useSections(pageSlug);
</script>

<template>
  <component :is="section" v-for="(section, index) in sectionComponents" :key="index" />
</template>
