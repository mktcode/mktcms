<script setup lang="ts">
import { useFetch, useRoute } from '#app'
import { ref, watch } from 'vue'
import Image from './image.vue'

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
    <div class="breadcrumbs">
      <a href="/admin">Hauptverzeichnis</a>
      <span
        v-for="(part, index) in pathParts"
        :key="index"
      >
        /
        <a :href="`/admin/${pathParts.slice(0, index + 1).join(':')}`">
          {{ part }}
        </a>
      </span>
    </div>

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
