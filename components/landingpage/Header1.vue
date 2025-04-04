<script setup lang="ts">
defineProps<{
  isLive?: boolean
}>()

const { state: website } = useWebsiteState()
const { public: { s3Endpoint } } = useRuntimeConfig()

const router = useRouter()
const contactLink = `${router.currentRoute.value.fullPath}#contact`

// const { data: menuItems } = await useFetch('/api/websites/menu', { params: { userId: props.website.userId } })
</script>

<template>
  <div class="h-screen bg-website-950 relative">
    <!-- <nav v-if="website.showMenu" class="absolute top-0 left-0 right-0 z-50 flex items-center justify-end p-6 gap-6 sm:gap-12 text-xl">
      <ULink
        v-for="item, index in menuItems"
        :key="index"
        :to="isLive ? item.path ?? '/' : `/website/${item.id}`"
        active-class="text-website-300"
        inactive-class="text-website-50 hover:text-website-200"
      >
        {{ item.title }}
      </ULink>
    </nav> -->
    <img
      v-if="website.image"
      :src="`${s3Endpoint}/mktcms/${website.image}`"
      class="h-1/3 sm:h-1/2 object-cover w-full opacity-70"
    />
    <div class="text-website-50 flex flex-col p-6 sm:p-12 lg:p-24 items-start justify-center gap-8 max-w-7xl">
      <div>
        <h1 class="text-7xl font-bold mb-2">
          {{ website.title }}
        </h1>
        <h2 class="text-4xl text-website-300">
          {{ website.subtitle }}
        </h2>
      </div>
      <p class="text-2xl opacity-80">
        {{ website.description }}
      </p>
      <UButton v-if="website.hasContactForm" size="xl" :to="contactLink" color="website">
        Kontakt aufnehmen
      </UButton>
    </div>
  </div>
</template>