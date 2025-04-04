<script setup lang="ts">
import type { Company } from '~/types';

const { state: website } = useWebsiteState()

defineProps<{
  company: Company
  isLive?: boolean
}>()
</script>

<template>
  <div class="h-48 flex flex-col justify-center items-center gap-4">
    <div class="flex justify-center items-center gap-4">
      <!-- Nuxt Link doesn't work here. Why? Because of missing NuxtPage?-->
      <a
        :href="isLive ? '/impressum' : `/website/${website.id}/impressum`"
        class="text-website-500"
      >
        Impressum
      </a>
      <a
        :href="isLive ? '/datenschutz' : `/website/${website.id}/datenschutz`"
        class="text-website-500"
      >
        Datenschutz
      </a>
    </div>
  </div>
</template>