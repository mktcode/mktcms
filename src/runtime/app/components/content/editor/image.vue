<script setup lang="ts">
import usePathParam from '../../../composables/usePathParam';

const { path } = usePathParam();
</script>

<template>
  <div>
    <button class="button secondary w-full justify-center mb-2" type="button">
      Link kopieren
    </button>
    <button class="button w-full justify-center mb-4" type="button">
      Bild austauschen
    </button>

    <img
      :src="`/api/admin/content/${path}`"
      alt="Image Preview"
      class="w-full h-auto border border-gray-200 rounded-sm p-1"
    >
  </div>
</template>
