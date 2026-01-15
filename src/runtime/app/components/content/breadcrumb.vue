<script setup lang="ts">
defineProps<{
  parts: string[]
}>()
</script>

<template>
  <div class="breadcrumbs">
    <NuxtLink to="/admin">Hauptverzeichnis</NuxtLink>
    <span
      v-for="(part, index) in parts"
      :key="index"
    >
      /
      <NuxtLink
        v-if="index < parts.length - 1"
        :to="`/admin/${parts.slice(0, index + 1).join(':')}`"
      >
        {{ part }}
      </NuxtLink>
      <span
        v-else
        style="font-weight: bold;"
      >
        {{ part }}
      </span>
    </span>
  </div>
</template>