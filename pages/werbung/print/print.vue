<script setup lang="ts">
definePageMeta({
  layout: 'print',
})

const title = 'Meine Firma GmbH'
const subtitle = 'Software und Internet'
const slogan = 'Ihr Partner für digitale Lösungen'
const description = 'Wir sind ein mittelständisches Unternehmen, das sich auf die Entwicklung von Software und Internetlösungen spezialisiert hat. Wir bieten Ihnen individuelle Lösungen für Ihre Anforderungen.'
const street = 'Musterstraße 123'
const zip = '12345'
const city = 'Musterstadt'
const phone = '0123456789'
const email = 'kontakt@markus-kottlaender.de'
</script>

<template>
  <div class="w-full">
    <PrintVcard
      :logo-width="120"
      :title="title"
      :subtitle="subtitle"
      :slogan="slogan"
      :description="description"
      :street="street"
      :zip="zip"
      :city="city"
      :phone="phone"
      :email="email"
    />
  </div>
</template>