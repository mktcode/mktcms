<script setup lang="ts">
import type { Vcard } from '~/types'

definePageMeta({
  layout: 'print',
})

const route = useRoute()
const vcard = await $fetch<Vcard>(`/api/vcards/${route.params.id}`)

if (!vcard) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Vcard not found'
  })
}
</script>

<template>
  <div class="w-full">
    <PrintVcard
      :logo-width="120"
      :title="vcard.title"
      :subtitle="vcard.subtitle || ''"
      :slogan="vcard.slogan || ''"
      :street="vcard.street || ''"
      :zip="vcard.zip || ''"
      :city="vcard.city || ''"
      :phone="vcard.phone || ''"
      :email="vcard.email || ''"
      :website="vcard.website || ''"
    />
  </div>
</template>