<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)

const { public: { s3Endpoint } } = useRuntimeConfig()
const { data: files, refresh } = await useFetch('/api/files')

const uploadFile = async () => {
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

onMounted(() => {
  fileInput.value?.addEventListener('change', uploadFile)
})
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAds />
    </template>
    <div class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-center w-full">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="size-24 mb-4 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Hier klicken</span> oder Dateien hierhin ziehen</p>
            <p class="text-xs text-gray-500">PDF, JPG, PNG, GIF oder SVG (Max. 5 MB)</p>
          </div>
          <input id="dropzone-file" type="file" class="hidden" capture multiple ref="fileInput" />
        </label>
      </div>
  
      <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="file in files" :key="file.key" class="bg-white shadow-sm rounded-lg p-2">
          <img :src="`${s3Endpoint}/mktcms/${file.key}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>