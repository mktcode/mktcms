<script setup lang="ts">
import type { InvoiceOutWithItemRelations } from '~/types'

definePageMeta({
  layout: 'print',
})

const route = useRoute()
const invoice = await $fetch<InvoiceOutWithItemRelations>(`/api/invoicesOut/${route.params.id}`)
const { data: company } = await useFetch('/api/company')
const customer = await $fetch(`/api/customers/${invoice.customerId}`)

if (!invoice || !company || !customer) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Fehler beim Laden der Rechnung',
  })
}
</script>

<template>
  <div class="w-full" v-if="invoice && company && customer">
    <PrintInvoiceOut :invoice="invoice" :company="company" :customer="customer" />
  </div>
</template>