<script setup lang="ts">
import type { Website } from '~/types';

defineProps<{
  website: Website
}>()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col sm:flex-row gap-6 p-6 sm:p-12 lg:p-24 sm:gap-12">
      <img src="~/assets/img/default-header.jpg" class="object-cover aspect-square w-full sm:w-96 mb-auto rounded-2xl" />
      <div class="text-primary-950 flex flex-col items-start justify-center gap-8">
        <div>
          <h1 class="text-5xl font-bold mb-2">
            {{ website.aboutTitle }}
          </h1>
          <h2 class="text-3xl text-primary-500">
            {{ website.aboutSubtitle }}
          </h2>
        </div>
        <p class="text-2xl opacity-70">
          {{ website.aboutText }}
        </p>
      </div>
    </div>
  </div>
</template>