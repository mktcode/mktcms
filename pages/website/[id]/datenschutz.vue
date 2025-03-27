<script setup lang="ts">
import type { Website, WebsiteContent } from '~/types'

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const route = useRoute()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const website = await $fetch<WebsiteWithContents>(`/api/websites/${id}`)
const company = await $fetch('/api/company/byUserId', { params: { id: website.userId } })

if (!website || !company) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite oder Firma nicht gefunden',
  })
}
</script>

<template>
  <NuxtLayout name="landingpage">
    <LandingpagePrivacy :website="website" :company="company" />
  </NuxtLayout>
</template>