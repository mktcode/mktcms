<script setup lang="ts">
import type { Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

defineProps<{
  website: WebsiteWithContents
}>()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-50">
    <div class="p-6 sm:p-12 lg:p-24 w-full mx-auto flex flex-wrap justify-center @container">
      <div v-for="content in website.contents" :key="content.id" class="w-full @md:w-1/2 @xl:w-1/3 p-6">
        <h3 class="text-5xl font-bold text-primary-950">
          {{ content.title }}
        </h3>
        <h4 class="text-3xl text-primary-500 mb-2">
          {{ content.subtitle }}
        </h4>
        <p class="text-2xl opacity-60 text-primary-950">
          {{ content.description }}
        </p>
      </div>
    </div>
  </div>
</template>