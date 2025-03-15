<script setup lang="ts">
import { de } from '@nuxt/ui/locale'
import type { Website } from './types'

const website = useState<Website | undefined>('website')
const { hostname, pathname } = useRequestURL()

await callOnce(async () => {
  website.value = await $fetch('/api/websites/byHost', {
    method: 'POST',
    body: { hostname, pathname }
  })
})
</script>

<template>
  <Landingpage v-if="website" :website="website" />
  <UApp v-else :locale="de">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
