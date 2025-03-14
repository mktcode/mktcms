<script setup lang="ts">
import type { Vcard } from '~/types';

const route = useRoute()
const vcard = ref<Vcard | null>(null);
const vcardId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingVcard = await $fetch<Vcard>(`/api/vcards/${vcardId}`);

  if (!existingVcard) {
    return;
  }
  
  vcard.value = existingVcard;
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAds />
    </template>
    <div class="p-6">
      <VcardsForm v-if="vcard" :vcard="vcard"/>
      <div v-else>Visitenkarte nicht gefunden</div>
    </div>
  </NuxtLayout>
</template>