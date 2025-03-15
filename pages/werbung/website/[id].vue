<script setup lang="ts">
import type { Website } from '~/types';

const route = useRoute()
const website = ref<Website | null>(null);
const websiteId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingWebsite = await $fetch<Website>(`/api/websites/${websiteId}`);

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
    <div class="p-6">
      <WebsitesForm v-if="website" :website="website"/>
      <div v-else>Website nicht gefunden</div>
    </div>
  </NuxtLayout>
</template>