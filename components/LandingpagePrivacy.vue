<script setup lang="ts">
import type { Company, Website, WebsiteContent } from '~/types';

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website: WebsiteWithContents
  company: Company
  isLive?: boolean
}>()

const { public: { s3Endpoint } } = useRuntimeConfig()

const appConfig = useAppConfig()
appConfig.ui.colors.primary = props.website.primaryColor || appConfig.ui.colors.primary

updateAppConfig(appConfig)

useSeoMeta({
  title: `${props.company.name} - ${props.website.title}`,
  description: props.website.description,
})

const { data: menuItems } = await useFetch('/api/websites/menu', { params: { userId: props.website.userId } })
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
    <div class="h-screen bg-white relative">
      <nav v-if="website.showMenu || company.logo || company.name" class="absolute top-0 left-0 right-0 z-50 flex items-center p-6 sm:px-12 lg:px-24 gap-6 sm:gap-12 text-xl">
        <div class="w-full flex justify-between gap-6">
          <div v-if="company.logo || company.name" class="flex items-center gap-4">
            <img
              v-if="company.logo"
              :src="`${s3Endpoint}/mktcms/${company.logo}`"
              alt="Logo"
              class="rounded-full w-24"
            />
            <div v-if="company.name">
              <div class="font-bold">
                {{ company.name }}
              </div>
              <div class="text-primary-500 text-sm">
                {{ company.name }}
              </div>
            </div>
          </div>
          <div class="ml-auto" v-if="website.showMenu">
            <ULink
              v-for="item, index in menuItems"
              :key="index"
              :to="isLive ? item.path ?? '/' : `/website/${item.id}`"
              active-class="text-primary-300"
              inactive-class="text-primary-50 hover:text-primary-200"
            >
              {{ item.title }}
            </ULink>
          </div>
        </div>
      </nav>
      <div class="flex flex-col p-6 sm:p-12 lg:p-24 items-start justify-end max-w-7xl prose-xl">
        <h1 class="text-gray-800 font-bold mt-24 mb-4">
          Datenschutzerklärung
        </h1>
        <h2 class="text-primary-500 mt-0">
          Gemäß DSGVO und BDSG
        </h2>
        <h3>
          Verantwortlich:
        </h3>
        <p>
          {{ company.name }}<br />
          {{ company.street }}<br />
          {{ company.zip }} {{ company.city }}
        </p>
        <h3>
          Welche Daten werden erhoben und warum?
        </h3>
        <p>
          Diese Website verwendet keine Cookies und keine Tracker. Es werden keine Inhalte oder Scripte von Drittanbietern geladen, die Ihre IP-Adresse speichern könnten. 
          <template v-if="website.hasContactForm">
            <br /><br />
            Wenn Sie das Kontaktformular auf dieser Website nutzen, werden folgende personenbezogene Daten verarbeitet:<br />
            Ihr Name, Ihre E-Mail-Adresse, Ihre Telefonnummer und Ihre persönliche Nachricht werden ausschließlich zur Beantwortung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben oder im Ausland gespeichert. Die rechtliche Grundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b und f der DSGVO.<br />
            <br />
            Die Daten werden so lange gespeichert, bis Ihre Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. 
          </template>
        </p>
      </div>
    </div>
    <LandingpageFooter :website="website" :company="company" :is-live="isLive" />
  </div>
</template>