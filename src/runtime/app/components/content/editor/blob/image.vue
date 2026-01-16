<script setup lang="ts">
const path = defineModel<string>('path')
</script>

<template>
  <div class="image-editor">
    <img
      :src="`/api/admin/content/${path}`"
      alt="Image Preview"
    >
  </div>
</template>
