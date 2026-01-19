<script setup lang="ts">
import usePathParam from '../../../composables/usePathParam';

const { path } = usePathParam();
</script>

<template>
  <div>
    <embed
      :src="`/api/admin/content/${path}`"
      type="application/pdf"
      class="w-full h-auto aspect-[5.5/8]"
    />
  </div>
</template>
