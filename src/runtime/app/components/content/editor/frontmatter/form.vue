<script setup lang="ts">
import FrontmatterInput from './input.vue'
import FrontmatterToggle from './toggle.vue'

const frontmatter = defineModel<Record<string, any>>('frontmatter', {
  required: true,
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      v-for="key in Object.keys(frontmatter)"
      :key="key"
    >
      <FrontmatterToggle
        v-if="typeof frontmatter[key] === 'boolean'"
        v-model:value="frontmatter[key]"
        :label="key"
      />
      <FrontmatterInput
        v-else
        v-model:value="frontmatter[key]"
        :label="key"
      />
    </div>
  </div>
</template>
