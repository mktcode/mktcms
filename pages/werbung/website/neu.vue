<script setup lang="ts">
import type { NewWebsiteForm } from '~/types';

const suggestions = ref<NewWebsiteForm | null>(null);

const { data: existingCompany } = await useFetch('/api/company')

if (existingCompany.value) {
  suggestions.value = {
    title: existingCompany.value.name,
  };
}
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAds />
    </template>
    <div class="p-6">
      <WebsitesForm :suggestions="suggestions" />
    </div>
  </NuxtLayout>
</template>