<script setup lang="ts">
import type { Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website: WebsiteWithContents
}>()

const router = useRouter()
const contactLink = `${router.currentRoute.value.fullPath}#contact`

const appConfig = useAppConfig()
appConfig.ui.colors.primary = props.website.primaryColor || appConfig.ui.colors.primary

const { public: { s3Endpoint } } = useRuntimeConfig()

updateAppConfig(appConfig)
</script>

<template>
  <div>
    <div class="h-screen flex items-center justify-center bg-primary-950">
      <img
        v-if="website.image"
        :src="`${s3Endpoint}/mktcms/${website.image}`"
        class="absolute inset-0 object-cover w-full h-full opacity-10"
      />
      <div class="relative z-10 text-primary-50 flex flex-col p-6 sm:p-12 lg:p-24 items-start justify-center gap-8 max-w-7xl">
        <div>
          <h1 class="text-7xl font-bold mb-2">
            {{ website.title }}
          </h1>
          <h2 class="text-4xl text-primary-300">
            {{ website.subtitle }}
          </h2>
        </div>
        <p class="text-2xl opacity-80">
          {{ website.description }}
        </p>
        <UButton v-if="website.hasContactForm" size="xl" :to="contactLink">
          Kontakt aufnehmen
        </UButton>
      </div>
    </div>
    <LandingpageAbout v-if="website.showAbout" :website="website" />
    <LandingpageContents v-if="website.showContents" :website="website" />
    <LandingpageContactForm v-if="website.hasContactForm" :website="website" />
  </div>
</template>