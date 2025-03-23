<script setup lang="ts">
const { public: { s3Endpoint } } = useRuntimeConfig()
const { data: files } = await useFetch('/api/files')
const showModal = ref(false)

const emit = defineEmits<{
  select: [image: string]
}>()

function onSelect(image: string) {
  showModal.value = false
  emit('select', image)
}
</script>

<template>
  <UModal v-model:open="showModal" title="Bild auswählen" icon="i-heroicons-photo" size="xl">
    <UButton label="Bild auswählen" icon="i-heroicons-photo" />

    <template #body>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="file in files" :key="file.key" class="cursor-pointer" @click="onSelect(file.key)">
          <img :src="`${s3Endpoint}/mktcms/${file.key}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg opacity-90 hover:opacity-100" />
        </div>
      </div>
    </template>
  </UModal>
</template>