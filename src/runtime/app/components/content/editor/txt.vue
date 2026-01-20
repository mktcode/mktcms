<script setup lang="ts">
import Saved from '../saved.vue'
import useSaveContent from '../../../composables/useSaveContent'

const { content, saveContent, isSaving, savingSuccessful } = await useSaveContent()
</script>

<template>
  <div>
    <textarea
      v-model="content"
      class="w-full h-24 resize-y border border-gray-300 p-2 box-border font-mono"
    />

    <button
      type="button"
      class="button w-full justify-center mt-3"
      @click="saveContent"
    >
      <span v-if="isSaving">Speichern...</span>
      <span v-else>Speichern</span>
    </button>
    <Saved v-if="savingSuccessful" />
  </div>
</template>
