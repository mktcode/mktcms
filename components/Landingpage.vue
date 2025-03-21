<script setup lang="ts">
import type { Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website: WebsiteWithContents
}>()

const appConfig = useAppConfig()
appConfig.ui.colors.primary = props.website.primaryColor || appConfig.ui.colors.primary

updateAppConfig(appConfig)
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
    <LandingpageHeader0 v-if="website.headerVariant === 0" :website="website" />
    <LandingpageHeader1 v-if="website.headerVariant === 1" :website="website" />
    <LandingpageAbout v-if="website.showAbout" :website="website" />
    <LandingpageContents v-if="website.showContents" :website="website" />
    <LandingpageContactForm v-if="website.hasContactForm" :website="website" />
  </div>
</template>