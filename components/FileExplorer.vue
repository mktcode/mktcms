<script setup lang="ts">
const props = defineProps<{
  show: boolean
  extensions: string[]
}>();

const emit = defineEmits<{
  select: [filename: string]
  close: []
}>()

const { data: files } = await useFetch('/api/files/list', {
  method: 'POST',
  body: { extensions: props.extensions },
})

const selectImage = (filename: string) => {
  emit('select', filename)
  emit('close')
}
</script>

<template>
  <Modal v-if="show">
    <div class="sm:flex sm:items-start">
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
          Bild wählen
        </h3>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div v-for="file in files" :key="file">
            <img :src="`/files/${file}`" alt="Kein Bild" class="w-20 h-20 object-cover object-center rounded-lg" />
            <button
              @click="selectImage(file)"
              type="button"
              class="button mt-2"
            >
              Auswählen
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>