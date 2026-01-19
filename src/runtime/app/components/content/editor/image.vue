<script setup lang="ts">
import usePathParam from '../../../composables/usePathParam';

const { path } = usePathParam();
</script>

<template>
  <div class="image-editor">
    <img
      :src="`/api/admin/content/${path}`"
      alt="Image Preview"
    >
  </div>
</template>
