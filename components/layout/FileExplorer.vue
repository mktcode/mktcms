<script setup lang="ts">
const { public: { s3Endpoint } } = useRuntimeConfig()
const { data: files, refresh } = await useFetch('/api/files')
const showModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  select: [image: string]
}>()

function onSelect(image: string) {
  showModal.value = false
  emit('select', image)
}

const uploadFile = async () => {
  console.log('uploadFile')
  const formData = new FormData()
  const files = fileInput.value?.files

  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    await $fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    })
    refresh()
  }
}
</script>

<template>
  <UModal v-model:open="showModal" title="Bild auswählen" icon="i-heroicons-photo" size="xl">
    <UButton label="Bild auswählen" icon="i-heroicons-photo" />

    <template #body>
      <div class="flex items-center justify-center w-full mb-4">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="size-12 mb-2 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-1 text-sm text-gray-500"><span class="font-semibold">Hier klicken</span> oder Dateien hierhin ziehen</p>
            <p class="text-xs text-gray-500">PDF, JPG, PNG, GIF oder SVG (Max. 5 MB)</p>
          </div>
          <input id="dropzone-file" type="file" class="hidden" capture multiple ref="fileInput" @change="uploadFile" />
        </label>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div v-for="file in files" :key="file.key" class="cursor-pointer" @click="onSelect(file.key)">
          <img :src="`${s3Endpoint}/mktcms/${file.key}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg opacity-90 hover:opacity-100" />
        </div>
      </div>
    </template>
  </UModal>
</template>