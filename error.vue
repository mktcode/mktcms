<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="default">
    <div class="flex flex-col items-center justify-center h-screen gap-4">
      <img src="~/assets/img/mktcms.png" alt="Error" class="w-3xs" />
      <h2 class="text-2xl text-center">
        Ups! Ein Fehler ist aufgetreten.
      </h2>
      <button @click="handleError" class="button mt-4">
        Zurück zur Startseite
      </button>
    </div>
  </NuxtLayout>
</template>
