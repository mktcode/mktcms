<script setup lang="ts">
import type { Website } from '~/types';

const props = defineProps<{
  website: Website
  isLive?: boolean
}>()

const { public: { s3Endpoint } } = useRuntimeConfig()

const router = useRouter()
const contactLink = `${router.currentRoute.value.fullPath}#contact`

const { data: menuItems } = await useFetch('/api/websites/menu', { params: { userId: props.website.userId } })

const showLogo = ref(true)
</script>

<template>
  <div class="h-screen bg-white relative">
    <nav v-if="website.showMenu || showLogo" class="absolute top-0 left-0 right-0 z-50 flex items-center p-6 sm:px-12 lg:px-24 gap-6 sm:gap-12 text-xl">
      <div class="w-full flex justify-between gap-6">
        <div v-if="showLogo" class="flex items-center gap-4">
          <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full w-24" />
          <div>
            <div class="font-bold">
              Markus GmbH
            </div>
            <div class="text-primary-500 text-sm">
              Eine GmbH zum Geld machen.
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
    <div class="h-1/2 flex flex-col p-6 sm:p-12 lg:p-24 !pb-6 items-start justify-end gap-8 max-w-7xl">
      <div>
        <h1 class="text-7xl text-gray-800 font-bold mb-2" v-if="website.title">
          {{ website.title }}
        </h1>
        <h2 class="text-4xl text-primary-500" v-if="website.subtitle">
          {{ website.subtitle }}
        </h2>
      </div>
      <p class="text-2xl text-primary-950 opacity-80" v-if="website.description">
        {{ website.description }}
      </p>
      <UButton v-if="website.hasContactForm" size="xl" :to="contactLink">
        Kontakt aufnehmen
      </UButton>
    </div>
    <img
      v-if="website.image"
      :src="`${s3Endpoint}/mktcms/${website.image}`"
      class="h-1/2 object-cover object-bottom w-full opacity-90 curved"
    />
  </div>

  <svg width="0" height="0">
    <defs>
      <clipPath id="curve-clip" clipPathUnits="objectBoundingBox">
        <path d="M0,0.25 C0.2,0.4 0.3,0.1 0.5,0.2 C0.7,0.3 0.8,0.05 1,0 L1,1 L0,1 Z" class="hidden sm:inline" />
        <path d="M0,0.20 C0.3,0.25 0.6,0.18 0.8,0.1 C0.9,0.05 1,0 1,0 L1,1 L0,1 Z" class="sm:hidden" />
      </clipPath>
    </defs>
  </svg>
</template>

<style scoped>
img.curved {
  clip-path: url(#curve-clip);
}
</style>