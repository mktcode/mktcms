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

  website.value = existingWebsite;
  company.value = existingCompany ?? null;
})
</script>

<template>
  <NuxtLayout name="editwebsite">
    <template #navbar2>
      <LayoutNavbarAds class="sticky top-[49px]" />
    </template>
    <div class="flex flex-col md:flex-row flex-1 h-full">
      <div class="w-full md:max-w-72 2xl:max-w-80 border-r border-gray-200 flex-1 overflow-y-scroll relative">
        <div class="flex flex-col gap-4 p-3">
          <h1 class="text-xl font-bold">
            {{ website ? website.title : 'Lade...' }}
          </h1>
          <UButton
            v-if="website?.domain"
            :to="`https://${website.domain}`"
            target="_blank"
            trailing-icon="i-lucide-external-link"
            variant="ghost"
          >
            Website öffnen
          </UButton>
        </div>
        <WebsitesForm v-if="website" :website="website"/>
      </div>
      <div class="flex-1 overflow-y-scroll">
        <Landingpage v-if="website && company" :website="website" :company="company" :is-live="false" />
        <div v-else class="flex flex-col items-center justify-center p-6 gap-4">
          <p>
            Sie haben noch keine Kontaktdaten Ihres Unternehmens angegeben. Diese sind erforderlich, für die Darstellung Ihrer Website.
          </p>
          <UButton to="/einstellungen/firma" size="xl">
            Kontaktdaten angeben
          </UButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>