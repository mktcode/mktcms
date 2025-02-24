<script setup lang="ts">
const props = defineProps<{
  contentId: number;
}>();
</script>

<template>
  <div class="h-screen flex flex-col">
    <WebsiteNavbar />
    <WebsiteHero :contentId="contentId" />
  </div>
</template>