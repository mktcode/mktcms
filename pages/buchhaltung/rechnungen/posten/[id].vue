<script setup lang="ts">
import type { Customer, InvoiceItem } from '~/types';

const route = useRoute()
const invoiceItem = ref<InvoiceItem | null>(null);
const invoiceItemId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingInvoiceItem = await $fetch<InvoiceItem>(`/api/invoiceItems/${invoiceItemId}`);

  if (!existingInvoiceItem) {
    return;
  }
  
  invoiceItem.value = existingInvoiceItem;
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting />
    </template>
    <div class="p-6">
      <InvoiceItemsForm v-if="invoiceItem" :invoiceItem="invoiceItem" />
      <div v-else>Posten nicht gefunden</div>
    </div>
  </NuxtLayout>
</template>