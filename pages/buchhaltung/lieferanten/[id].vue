<script setup lang="ts">
import type { Supplier } from '~/types';

const route = useRoute()
const supplier = ref<Supplier | null>(null);
const supplierId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingSupplier = await $fetch<Supplier>(`/api/suppliers/${supplierId}`);

  if (!existingSupplier) {
    return;
  }
  
  supplier.value = existingSupplier;
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting />
    </template>
    <div class="p-6">
      <SuppliersForm v-if="supplier" :supplier="supplier"/>
      <div v-else>Lieferant nicht gefunden</div>
    </div>
  </NuxtLayout>
</template>