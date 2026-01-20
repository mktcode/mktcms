<script setup lang="ts">
import FrontmatterInput from './input.vue'

const frontmatter = defineModel<Record<string, any>>('frontmatter', {
  required: true,
})
</script>

<template>
  <div class="flex gap-2">
    <FrontmatterInput
      v-for="key in Object.keys(frontmatter)"
      :key="key"
      :label="key"
      v-model:value="frontmatter[key]"
    />
  </div>
</template>