<script setup lang="ts">
import type { Customer } from '~/types';
import type { Project } from '~/types';

const currentProject = ref<Project | null>(null);
const customer = ref<Customer | null>(null);

const route = useRoute()
const customerId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

onMounted(async () => {
  const projects = await $fetch('/api/projectList');
  const existingCustomer = await $fetch<Customer>(`/api/customers/${customerId}`);

  if (projects.length === 0 || !existingCustomer) {
    return;
  }
  
  currentProject.value = projects[0];
  customer.value = existingCustomer;
})

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
</script>

<template>
  <div>
    <CustomersForm v-if="currentProject && customer" :project="currentProject" :customer="customer"/>
    <div v-else>Kunde nicht gefunden</div>
  </div>
</template>