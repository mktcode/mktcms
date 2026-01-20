<script setup lang="ts">
import usePathParam from '../../../composables/usePathParam'

const { path } = usePathParam()
</script>

<template>
  <div>
    <button
      class="button secondary w-full justify-center mb-2"
      type="button"
    >
      Link kopieren
    </button>
    <button
      class="button w-full justify-center mb-4"
      type="button"
    >
      PDF austauschen
    </button>
    <embed
      :src="`/api/admin/content/${path}`"
      type="application/pdf"
      class="w-full h-auto aspect-[5.5/8] border border-gray-200 rounded-sm"
    >
  </div>
</template>
