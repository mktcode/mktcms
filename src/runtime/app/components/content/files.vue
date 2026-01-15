<script setup lang="ts">
defineProps<{
  path: string
  files: string[]
}>()
</script>

<template>
  <div class="files">
    <NuxtLink
      v-for="file in files"
      :key="file"
      :to="`/admin/edit/${file.match(/\.md$|\.csv$|\.txt$|\.json$/i) ? 'text' : 'blob'}/${path ? path + ':' : ''}${file}`"
    >
      <img
        v-if="file.match(/\.png$|\.jpg$|\.jpeg$|\.gif$|\.svg$|\.webp$/i)"
        :src="`/api/content/${path ? path + ':' : ''}${file}`"
        alt="Vorschaubild"
        style="width: 64px; height: 64px; vertical-align: middle; margin-right: 4px; object-fit: cover;"
      />
      {{ file }}
    </NuxtLink>
  </div>
</template>