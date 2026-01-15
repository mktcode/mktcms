<script setup lang="ts">
import { useRoute } from '#app'
import { ref } from 'vue'
import Image from './image.vue'
import Breadcrumb from '../../breadcrumb.vue'

const path = useRoute().params.path as string || ''
const pathParts = path.split(':')

const isSaving = ref(false)
const savingSuccessful = ref(false)

async function saveContent() {
  isSaving.value = true
  savingSuccessful.value = false

  // simulate saving delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  isSaving.value = false
  savingSuccessful.value = true
}
</script>

<template>
  <div>
    <Breadcrumb :parts="pathParts" />

    <div>
      <Image
        v-if="path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)"
        :path="path"
      />
      <button
        style="margin-top: 10px;"
        @click="saveContent"
      >
        <span v-if="isSaving">Speichern...</span>
        <span v-else>Speichern</span>
      </button>
      <span v-if="savingSuccessful" style="color: green; margin-left: 10px;">✔️ Gespeichert</span>
    </div>
  </div>
</template>
