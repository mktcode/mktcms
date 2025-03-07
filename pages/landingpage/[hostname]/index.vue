<script setup lang="ts">
definePageMeta({
  layout: 'landingpage',
})

async function loadData(hostname: string) {
  if (hostname === 'localhost') {
    return null;
  }

  return {
    title: 'My website at ' + hostname,
  }
}

const route = useRoute()

const data = await loadData(route.params.hostname as string)

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