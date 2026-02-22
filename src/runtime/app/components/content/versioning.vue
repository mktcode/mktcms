<script setup lang="ts">
import { ref } from 'vue'

const currentBranch = ref('main')
</script>

<template>
  <div class="text-sm text-gray-700">
    <div class="flex items-center justify-between gap-3">
      <button
        type="button"
        class="button small secondary ml-auto"
      >
        Version: <strong>{{ currentBranch }}</strong>
      </button>
      <button
        type="button"
        class="button small secondary"
      >
        Aktualisieren
      </button>
    </div>
  </div>
</template>
