<script setup lang="ts">
import { useRuntimeConfig } from '#app';
import useFileType from '../../composables/useFileType';

const { filePath } = defineProps<{ filePath: string }>()

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig();
const { isImage, isCsv, isMarkdown, isText, isPdf } = useFileType(filePath);
</script>

<template>
  <img v-if="isImage" :src="`${siteUrl}/api/content/${filePath}`" alt="Vorschaubild"
    class="size-6 rounded-sm object-cover mr-1">
  <svg v-if="isCsv" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6 opacity-20">
    <path d="M12 3v18" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
  <svg v-if="isMarkdown || isText" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="size-6 opacity-20">
    <path
      d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
  <svg v-if="isPdf" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    class="size-6 opacity-20">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M10 8v8h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zm-7 4h2a2 2 0 1 0 0-4H3v8m14-4h3m1-4h-4v8" />
  </svg>
</template>