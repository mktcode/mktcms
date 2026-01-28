<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import usePathParam from '../../../composables/usePathParam'
import { useSiteUrl } from '#imports';
import useImageUpload from '../../../composables/useImageUpload';

const { path } = usePathParam()
const siteUrl = useSiteUrl()

const { copy, copied } = useClipboard()

const { isUploading, fileInput, uploadFiles } = useImageUpload()
</script>

<template>
  <div>
    <button
      class="button secondary w-full justify-center mb-2"
      type="button"
      @click.prevent="copy(siteUrl + '/api/content/' + path)"
    >
      <svg
        v-if="copied"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </svg>
      Link kopieren
    </button>
    <button
      class="button w-full justify-center mb-4"
      type="button"
      :disabled="isUploading"
      @click="fileInput?.click()"
    >
      Bild austauschen
    </button>
    <input
      ref="fileInput"
      class="hidden"
      type="file"
      accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
      @change="async (e) => { await uploadFiles(e, path); }"
    >

    <img
      :src="`/api/admin/blob?path=${path}`"
      alt="Image Preview"
      class="w-full h-auto border border-gray-200 rounded-sm p-1"
    >
  </div>
</template>
