<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="flex gap-4 mb-8">
    <button class="button">
      <CheckIcon class="size-5 opacity-50" />
      Ich brauche beides.
    </button>
    <button class="button light">
      Ich bin versorgt.
    </button>
  </div>
</template>