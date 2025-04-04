<script setup lang="ts">
import type { Company, Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website: WebsiteWithContents
  company: Company
  isLive?: boolean
}>()

const appConfig = useAppConfig()

const { state } = useWebsiteState(props.website)

watch(state.value, () => {
  appConfig.ui.colors.website = state.value.primaryColor || appConfig.ui.colors.primary
}, { immediate: true })

updateAppConfig(appConfig)

useSeoMeta({
  title: `${props.company.name} - ${props.website.title}`,
  description: props.website.description,
})
</script>

<template>
  <div :class="{
    'font-roboto': state.font === 'roboto',
    'font-open-sans': state.font === 'open-sans',
    'font-lato': state.font === 'lato',
    'font-montserrat': state.font === 'montserrat',
    'font-poppins': state.font === 'poppins',
    'font-merriweather': state.font === 'merriweather',
    'font-lora': state.font === 'lora',
    'font-playfair-display': state.font === 'playfair-display',
  }">
    <LandingpageHeader0 v-if="state.headerVariant === 0" :isLive="isLive" />
    <LandingpageHeader1 v-if="state.headerVariant === 1" :isLive="isLive" />
    <LandingpageHeader2 v-if="state.headerVariant === 2" :company="company" :isLive="isLive" />
    <LandingpageAbout v-if="state.showAbout" />
    <LandingpageContents v-if="state.showContents" />
    <LandingpageContactForm v-if="state.hasContactForm" />
    <LandingpageFooter :company="company" :isLive="isLive" />
  </div>
</template>