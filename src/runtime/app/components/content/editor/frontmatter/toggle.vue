<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
}>(), {
  label: '',
})

const value = defineModel<boolean>('value', {
  required: true,
})
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="font-bold inline-flex items-center">
      <input
        v-model="value"
        type="checkbox"
        class="mr-2"
      >
      <span v-if="props.label">{{ props.label }}</span>
    </label>
    <div class="relative" />
  </div>
</template>
