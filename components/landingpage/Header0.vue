<script setup lang="ts">
import type { Website } from '~/types';

defineProps<{
  website: Website
}>()

const { public: { s3Endpoint } } = useRuntimeConfig()

const router = useRouter()
const contactLink = `${router.currentRoute.value.fullPath}#contact`
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-primary-950">
    <img
      v-if="website.image"
      :src="`${s3Endpoint}/mktcms/${website.image}`"
      class="absolute inset-0 object-cover w-full h-full opacity-10"
    />
    <div class="relative z-10 text-primary-50 flex flex-col p-6 sm:p-12 lg:p-24 items-start justify-center gap-8 max-w-7xl">
      <div>
        <h1 class="text-7xl font-bold mb-2">
          {{ website.title }}
        </h1>
        <h2 class="text-4xl text-primary-300">
          {{ website.subtitle }}
        </h2>
      </div>
      <p class="text-2xl opacity-80">
        {{ website.description }}
      </p>
      <UButton v-if="website.hasContactForm" size="xl" :to="contactLink">
        Kontakt aufnehmen
      </UButton>
    </div>
  </div>
</template>