<script setup lang="ts">
import { de } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="de">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
