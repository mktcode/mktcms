<script setup lang="ts">
import type { Company, Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const route = useRoute()
const website = ref<WebsiteWithContents | null>(null);
const websiteId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)
const company = ref<Company | null>(null);

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingWebsite = await $fetch<WebsiteWithContents>(`/api/websites/${websiteId}`);
  const existingCompany = await $fetch(`/api/company`);

  if (!existingWebsite || !existingCompany) {
    return;
  }
  
  website.value = existingWebsite;
  company.value = existingCompany;
})
</script>

<template>
  <NuxtLayout name="fullwidth">
    <template #navbar2>
      <LayoutNavbarAds />
    </template>
    <div class="flex flex-col md:flex-row">
      <div class="md:w-72 2xl:w-80 flex-none">
        <div class="flex flex-col gap-4 p-3">
          <h1 class="text-xl font-bold">
            {{ website ? website.title : 'Lade...' }}
          </h1>
          <UButton v-if="website" :to="`/website/${website.id}`" target="_blank" trailing-icon="i-lucide-external-link" variant="ghost">
            Website öffnen
          </UButton>
        </div>
        <WebsitesForm v-if="website" :website="website"/>
      </div>
      <div class="flex-1">
        <Landingpage v-if="website && company" :website="website" :company="company" :is-live="false" />
      </div>
    </div>
  </NuxtLayout>
</template>