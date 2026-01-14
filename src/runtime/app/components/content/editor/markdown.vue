<script setup lang="ts">
const content = defineModel<string>('content')
</script>

<template>
  <div>
    <textarea
      v-model="content"
      style="width: 100%; height: 400px; resize: vertical; border: 1px solid red;"
    />
  </div>
</template>