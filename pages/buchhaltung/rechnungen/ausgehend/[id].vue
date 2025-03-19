<script setup lang="ts">
import type { InvoiceOut } from '~/types';

const route = useRoute()
const invoice = ref<InvoiceOut | null>(null);
const invoiceId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingInvoice = await $fetch<InvoiceOut>(`/api/invoicesOut/${invoiceId}`);
  
  invoice.value = existingInvoice;
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting />
    </template>
    <div class="p-6">
      <InvoicesOutForm v-if="invoice" :invoice="invoice"/>
      <div v-else>Rechnung nicht gefunden</div>
    </div>
  </NuxtLayout>
</template>