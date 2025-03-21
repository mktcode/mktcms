<script setup lang="ts">
import type { Company, Customer, InvoiceOut } from '~/types';

defineProps<{
  invoice: InvoiceOut
  customer: Customer
  company: Company
}>()
</script>

<template>
  <div class="bg-white flex flex-col text-gray-950">
    <div class="p-12 flex items-center gap-6">
      <div>
        <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full w-24" />
      </div>
      <div class="font-bold text-2xl leading-none">
        Rechnung
      </div>
    </div>
    <div class="p-12 flex items-center gap-6">
      <div class="w-1/2">
        <div class="font-bold text-lg">Rechnung an:</div>
        <div>{{ customer.name }}</div>
        <div>{{ customer.address }}</div>
        <div>{{ customer.zip }} {{ customer.city }}</div>
      </div>
      <div class="w-1/2">
        <div class="font-bold text-lg">Rechnung von:</div>
        <div>{{ company.name }}</div>
        <div>{{ company.street }}</div>
        <div>{{ company.zip }} {{ company.city }}</div>
      </div>
    </div>
  </div>
</template>