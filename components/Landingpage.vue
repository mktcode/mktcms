<script setup lang="ts">
import type { Company, Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website: WebsiteWithContents
  company: Company
  isLive?: boolean
}>()

const appConfig = useAppConfig()
appConfig.ui.colors.primary = props.website.primaryColor || appConfig.ui.colors.primary

updateAppConfig(appConfig)

useSeoMeta({
  title: `${props.company.name} - ${props.website.title}`,
  description: props.website.description,
})
</script>

<template>
  <div :class="{
    'font-roboto': website.font === 'roboto',
    'font-open-sans': website.font === 'open-sans',
    'font-lato': website.font === 'lato',
    'font-montserrat': website.font === 'montserrat',
    'font-poppins': website.font === 'poppins',
    'font-merriweather': website.font === 'merriweather',
    'font-lora': website.font === 'lora',
    'font-playfair-display': website.font === 'playfair-display',
  }">
    <LandingpageHeader0 v-if="website.headerVariant === 0" :website="website" :isLive="isLive" />
    <LandingpageHeader1 v-if="website.headerVariant === 1" :website="website" :isLive="isLive" />
    <LandingpageHeader2 v-if="website.headerVariant === 2" :website="website" :company="company" :isLive="isLive" />
    <LandingpageAbout v-if="website.showAbout" :website="website" />
    <LandingpageContents v-if="website.showContents" :website="website" />
    <LandingpageContactForm v-if="website.hasContactForm" :website="website" />
    <LandingpageFooter :website="website" :company="company" :isLive="isLive" />
  </div>
</template>