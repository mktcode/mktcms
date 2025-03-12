<script setup lang="ts">
import type { Customer } from '~/types';

const route = useRoute()
const customer = ref<Customer | null>(null);
const customerId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

onMounted(async () => {
  const existingCustomer = await $fetch<Customer>(`/api/customers/${customerId}`);

  if (!existingCustomer) {
    return;
  }
  
  customer.value = existingCustomer;
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting />
    </template>
    <CustomersForm v-if="customer" :customer="customer"/>
    <div v-else>Kunde nicht gefunden</div>
  </NuxtLayout>
</template>