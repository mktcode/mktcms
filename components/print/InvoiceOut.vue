<script setup lang="ts">
import type { Company, Customer, InvoiceOutWithItemRelations } from '~/types';

const props = defineProps<{
  invoice: InvoiceOutWithItemRelations
  customer: Customer
  company: Company
}>()

const total = computed(() => {
  return props.invoice.items?.reduce((acc, item) => {
    const itemPrice = props.invoice.items.find((i) => i.id === item.itemId)?.price ?? 0
    return acc + itemPrice * (item.quantity ?? 0) * (1 - (props.invoice.discount ?? 0) / 100)
  }, 0) ?? 0
})

const { public: { s3Endpoint } } = useRuntimeConfig()
</script>

<template>
  <div class="bg-white flex flex-col text-gray-950">
    <div class="p-12 flex items-center gap-6">
      <div>
        <img :src="`${s3Endpoint}/mktcms/${company.logo}`" class="w-24" />
      </div>
      <div class="font-bold text-2xl leading-none">
        {{ company.name }}
      </div>
    </div>
    <div class="px-12 pb-12 flex items-center gap-6">
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
    <div class="px-12">
      <h1 class="font-bold text-2xl">
        Rechnung
      </h1>
      <div>
        Rechnungsnummer: {{ invoice.id }}
      </div>
      <div>
        Rechnungsdatum: {{ invoice.date }}
      </div>
    </div>
    <div class="p-12">
      <table class="w-full table">
        <thead>
          <tr>
            <th class="border-b pb-2 border-gray-300 text-left">Artikel</th>
            <th class="border-b pb-2 border-gray-300 text-center">Datum</th>
            <th class="border-b pb-2 border-gray-300 text-right">Einzelpreis</th>
            <th class="border-b pb-2 border-gray-300 text-right">Menge</th>
            <th class="border-b pb-2 border-gray-300 text-right">Betrag</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="relation in invoice.items" :key="relation.id">
            <td class="border-b border-gray-300 py-2">
              <div class="font-bold">
                {{ relation.title }}
              </div>
              <div class="text-sm text-gray-600">
                {{ relation.description }}
              </div>
            </td>
            <td class="border-b border-gray-300 text-center whitespace-nowrap px-2">
              {{ relation.date }}
            </td>
            <td class="border-b border-gray-300 text-right whitespace-nowrap px-2">
              {{ formatPrice(relation.price) }}
            </td>
            <td class="border-b border-gray-300 text-right whitespace-nowrap px-2">
              {{ relation.quantity }} {{ relation.unit }}
            </td>
            <td class="border-b border-gray-300 text-right whitespace-nowrap pl-2">
              {{ formatPrice(relation.price * relation.quantity) }}
            </td>
          </tr>
          <tr v-if="invoice.discount" class="border-b border-gray-300">
            <td class="border-b border-gray-300"></td>
            <td class="border-b border-gray-300"></td>
            <td class="border-b border-gray-300"></td>
            <td class="border-b border-gray-300 text-right font-bold py-3">Rabatt:</td>
            <td class="border-b border-gray-300 text-right font-bold py-3">
              {{ formatPrice(total * (invoice.discount / 100)) }}
            </td>
          </tr>
          <tr>
            <td class="border-b border-gray-300"></td>
            <td class="border-b border-gray-300"></td>
            <td class="border-b border-gray-300"></td>
            <td class="border-b border-gray-300 text-right font-bold py-3">Gesamt:</td>
            <td class="border-b border-gray-300 text-right font-bold py-3">
              {{ formatPrice(total) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="company.isSmallBusiness" class="mt-2 text-sm text-gray-600 text-right">
        Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
      </div>
      <div class="mt-6">
        <div class="mb-2">
          Bitte überweisen Sie den Gesamtbetrag auf das folgende Konto:
        </div>
        <table>
          <tbody>
            <tr>
              <td class="font-bold pr-4">Inhaber:</td>
              <td>{{ company.bankHolder }}</td>
            </tr>
            <tr>
              <td class="font-bold pr-4">IBAN:</td>
              <td>{{ company.bankIban }}</td>
            </tr>
            <tr>
              <td class="font-bold pr-4">BIC:</td>
              <td>{{ company.bankBic }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>