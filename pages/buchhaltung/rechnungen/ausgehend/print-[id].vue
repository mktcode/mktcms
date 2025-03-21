<script setup lang="ts">
import type { InvoiceOut } from '~/types'

definePageMeta({
  layout: 'print',
})

const route = useRoute()
const invoice = await $fetch<InvoiceOut>(`/api/invoicesOut/${route.params.id}`)

if (!invoice) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Rechnung nicht gefunden',
  })
}
</script>

<template>
  <div class="w-full">
    <PrintInvoiceOut  :invoice="invoice" />
  </div>
</template>