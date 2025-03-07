<script setup lang="ts">
definePageMeta({
  layout: 'landingpage',
})

const route = useRoute()
const hostname = Array.isArray(route.params.hostname) ? route.params.hostname[0] : route.params.hostname
const data = await $fetch(`/api/data/${hostname}`)

if (!data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
  })
}
</script>

<template>
  <Landingpage :title="data.title" />
</template>