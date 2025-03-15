<script setup lang="ts">
import type { Website } from '~/types'

definePageMeta({
  layout: 'landingpage',
})

const route = useRoute()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const website = await $fetch<Website>(`/api/websites/${id}`)

if (!website) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
  })
}
</script>

<template>
  <Landingpage :website="website" />
</template>