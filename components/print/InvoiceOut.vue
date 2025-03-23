<script setup lang="ts">
import type { Company, Customer, InvoiceOutWithItemRelations } from '~/types';

defineProps<{
  invoice: InvoiceOutWithItemRelations
  customer: Customer
  company: Company
}>()

function formatPrice(price: number) {
  return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}
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
    <div class="p-12">
      <table class="w-full table">
        <thead>
          <tr>
            <th class="border-b border-gray-300 text-left">Artikel</th>
            <th class="border-b border-gray-300 text-center">Datum</th>
            <th class="border-b border-gray-300 text-right">Einzelpreis</th>
            <th class="border-b border-gray-300 text-right">Menge</th>
            <th class="border-b border-gray-300 text-right">Betrag</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="relation in invoice.items" :key="relation.id">
            <td class="border-b border-gray-300">
              <div class="font-bold">
                {{ relation.title }}
              </div>
              <div>
                {{ relation.description }}
              </div>
            </td>
            <td class="border-b border-gray-300 text-center">
              {{ relation.date }}
            </td>
            <td class="border-b border-gray-300 text-right">
              {{ formatPrice(relation.price) }}
            </td>
            <td class="border-b border-gray-300 text-right">
              {{ relation.quantity }} {{ relation.unit }}
            </td>
            <td class="border-b border-gray-300 text-right">
              {{ formatPrice(relation.price * relation.quantity) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>