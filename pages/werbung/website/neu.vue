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
    <h1 class="text-2xl font-bold p-6">
      Neue Website
    </h1>
    <WebsitesForm :suggestions="suggestions" />
  </NuxtLayout>
</template>