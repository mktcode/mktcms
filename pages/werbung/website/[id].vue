<script setup lang="ts">
import type { Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const route = useRoute()
const website = ref<WebsiteWithContents | null>(null);
const websiteId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingWebsite = await $fetch<WebsiteWithContents>(`/api/websites/${websiteId}`);

  if (!existingWebsite) {
    return;
  }
  
  website.value = existingWebsite;
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAds />
    </template>
    <div class="flex items-center gap-4 p-6">
      <h1 class="text-2xl font-bold">
        {{ website ? website.title : 'Lade...' }}
      </h1>
      <UButton v-if="website" :to="`/website/${website.id}`" target="_blank" icon="i-lucide-external-link" variant="ghost">
        Website öffnen
      </UButton>
    </div>
    <WebsitesForm v-if="website" :website="website"/>
  </NuxtLayout>
</template>