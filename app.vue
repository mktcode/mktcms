<script setup lang="ts">
import { de } from '@nuxt/ui/locale'
import type { Company, Website, WebsiteContent } from './types'

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const { public: { appUrl } } = useRuntimeConfig()
const website = useState<WebsiteWithContents | undefined>('website')
const company = useState<Company | undefined>('company')
const { hostname, pathname, origin } = useRequestURL()
const isImprint = pathname === '/impressum'

await callOnce(async () => {
  website.value = await $fetch('/api/websites/byHost', {
    method: 'POST',
    body: { hostname, pathname }
  })

  if (!website.value && origin !== appUrl) {
    throw createError({
      statusCode: 404,
      message: 'Website not found'
    })
  }

  if (website.value) {
    company.value = await $fetch('/api/company/byUserId', {
      params: { id: website.value.userId }
    })

    if (!company.value) {
      throw createError({
        statusCode: 404,
        message: 'Company not found'
      })
    }
  }
})
</script>

<template>
  <LandingpageImprint v-if="website && company && isImprint" :website="website" :company="company" :is-live="true" />
  <Landingpage v-else-if="website && company" :website="website" :company="company" :is-live="true" />
  <UApp v-else :locale="de">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
