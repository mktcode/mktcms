<script setup lang="ts">
const { primaryColor, primaryColorHover } = await useTheme()
</script>

<template>
  <div class="w-full overflow-x-hidden website">
    <slot />
  </div>
</template>

<style>
.button {
  background-color: v-bind(primaryColor);

  &:hover {
    background-color: v-bind(primaryColorHover);
  }
}
</style>