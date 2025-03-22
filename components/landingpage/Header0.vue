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
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-primary-950">
    <nav v-if="website.showMenu" class="absolute top-0 left-0 right-0 z-50 flex items-center justify-end p-6 gap-6 sm:gap-12 text-xl">
      <ULink
        v-for="item, index in menuItems"
        :key="index"
        :to="isLive ? item.path ?? '/' : `/website/${item.id}`"
        active-class="text-primary-300"
        inactive-class="text-primary-50 hover:text-primary-200"
      >
        {{ item.title }}
      </ULink>
    </nav>
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
</template>