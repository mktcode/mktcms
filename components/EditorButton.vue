<script setup lang="ts">
defineEmits<{
  click: void;
}>()

defineProps<{
  isActive: boolean;
}>();
</script>

<template>
  <button @click.prevent="$emit('click')" class="px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100" :class="{ 'font-bold bg-blue-500 text-white': isActive }">
    <slot />
  </button>
</template>