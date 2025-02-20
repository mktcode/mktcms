<script setup lang="ts">
const sectionComponents = await useSections();
</script>

<template>
  <component :is="section" v-for="(section, index) in sectionComponents" :key="index" />
</template>
