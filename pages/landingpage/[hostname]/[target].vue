<script setup lang="ts">
definePageMeta({
  layout: 'landingpage',
})

async function loadData(hostname: string, pathname: string) {
  if (hostname === 'localhost') {
    return null;
  }

  return {
    title: 'My Add at ' + hostname + ' for ' + pathname,
  }
}

const route = useRoute()

const data = await loadData(route.params.hostname as string, route.params.target as string)

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