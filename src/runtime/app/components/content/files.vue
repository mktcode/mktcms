<script setup lang="ts">
import usePathParam from '../../composables/usePathParam'
import FileIcon from './fileIcon.vue'
import FileButtons from './fileButtons.vue'

defineProps<{
  files: string[]
}>()

const { path } = usePathParam()

function filenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function fileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/)
  return match && match[1] ? match[1] : ''
}
</script>

<template>
  <div>
    <div
      v-for="file in files"
      :key="file"
      class="flex gap-2 mb-2"
    >
      <NuxtLink
        :to="`/admin/edit/${fileExtension(file) === 'md' ? 'markdown/' : ''}${path ? path + ':' : ''}${file}`"
        class="flex-1 button secondary"
      >
        <FileIcon :file-path="`${path ? path + ':' : ''}${file}`" />
        <div class="w-full flex">
          {{ filenameWithoutExtension(file) }}
          <span
            v-if="fileExtension(file)"
            class="text-sm text-gray-400 ml-auto"
          >
            .{{ fileExtension(file) }}
          </span>
        </div>
      </NuxtLink>
      <FileButtons :file-path="`${path ? path + ':' : ''}${file}`" />
    </div>
  </div>
</template>
