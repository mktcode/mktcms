<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const adminWasHere = useLocalStorage('mktcms_admin_was_here', false);
</script>

<template>
  <ClientOnly>
    <div
      v-if="adminWasHere"
      class="absolute top-5 right-5"
    >
      <slot />
    </div>
  </ClientOnly>
</template>