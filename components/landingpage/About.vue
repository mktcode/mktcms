<script setup lang="ts">
import type { Website } from '~/types';

defineProps<{
  website: Website
}>()

const { public: { s3Endpoint } } = useRuntimeConfig()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col sm:flex-row gap-6 p-6 sm:p-12 lg:p-24 sm:gap-12">
      <img
        v-if="website.aboutImage"
        :src="`${s3Endpoint}/mktcms/${website.aboutImage}`"
        class="object-cover aspect-square w-full sm:w-96 mb-auto rounded-full"
      />
      <div class="flex flex-col items-start justify-center gap-8">
        <div>
          <h1 class="text-5xl text-gray-800 font-bold mb-2">
            {{ website.aboutTitle }}
          </h1>
          <h2 class="text-3xl text-primary-500">
            {{ website.aboutSubtitle }}
          </h2>
        </div>
        <p class="text-2xl text-primary-950 opacity-70 leading-normal">
          {{ website.aboutText }}
        </p>
      </div>
    </div>
  </div>
</template>