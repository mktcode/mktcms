<script setup lang="ts">
import usePathParam from '../../composables/usePathParam';
import FileIcon from './fileIcon.vue';
import FileButtons from './fileButtons.vue';

defineProps<{
  files: string[]
}>()

const { path } = usePathParam();
</script>

<template>
  <div>
    <div
      v-for="file in files"
      :key="file"
      class="flex gap-2 mb-2"
    >
      <NuxtLink
        :to="`/admin/edit/${path ? path + ':' : ''}${file}`"
        class="flex-1 button secondary"
      >
        <FileIcon :filePath="`${path ? path + ':' : ''}${file}`" />
        {{ file }}
      </NuxtLink>
      <FileButtons :file-path="`${path ? path + ':' : ''}${file}`" />
    </div>
  </div>
</template>
