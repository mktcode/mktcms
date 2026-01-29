<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const adminWasHere = useLocalStorage('mktcms_admin_was_here', false)
</script>

<template>
  <ClientOnly>
    <div v-if="adminWasHere">
      <slot />
    </div>
  </ClientOnly>
</template>
