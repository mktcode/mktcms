<script setup lang="ts">
const frontmatter = defineModel<Record<string, any>>('frontmatter', {
  required: true,
})
</script>

<template>
  <div class="flex gap-2">
    <div
      class="flex flex-col gap-2 w-full"
      v-for="(_, key) in frontmatter" :key="key"
    >
      <label :for="`frontmatter-${key}`" class="font-bold">
        {{ key }}
      </label>
      <input
        v-model="frontmatter[key]"
        type="text"
        class="w-full!"
        :id="`frontmatter-${key}`"
      />
    </div>
  </div>
</template>