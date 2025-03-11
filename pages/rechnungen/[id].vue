<script setup lang="ts">
import type { Customer, Invoice } from '~/types';
import type { Project } from '~/types';

const currentProject = ref<Project | null>(null);
const invoice = ref<Invoice | null>(null);

const route = useRoute()
const invoiceId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

onMounted(async () => {
  const projects = await $fetch('/api/projectList');
  const existingInvoice = await $fetch<Invoice>(`/api/invoices/${invoiceId}`);

  if (projects.length === 0 || !existingInvoice) {
    return;
  }
  
  currentProject.value = projects[0];
  invoice.value = existingInvoice;
})

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
</script>

<template>
  <div>
    <InvoicesForm v-if="currentProject && invoice" :project="currentProject" :invoice="invoice"/>
    <div v-else>Rechnung nicht gefunden</div>
  </div>
</template>