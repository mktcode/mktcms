<script setup lang="ts">
import type { Website } from '~/types';

defineProps<{
  website: Website
}>()
</script>

<template>
  <div>
    <div class="h-screen flex items-center justify-center">
      <img src="~/assets/img/default-header.jpg" class="absolute inset-0 object-cover w-full h-full brightness-50" />
      <div class="relative z-10 text-white text-center">
        <h1 class="text-6xl font-bold">
          {{ website.title }}
        </h1>
        <h2 class="text-2xl">
          {{ website.subtitle }}
        </h2>
      </div>
    </div>
  </div>
</template>