<script setup lang="ts">
import type { Website } from '~/types';

defineProps<{
  website: Website
}>()
</script>

<template>
  <h1>{{ website.title }}</h1>
</template>