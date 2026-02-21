<script setup lang="ts">
import { computed, ref } from 'vue'
import SelectFile from '../selectFile/index.vue'

const props = withDefaults(defineProps<{
  label?: string
}>(), {
  label: '',
})

const value = defineModel<string | number>('value', {
  required: true,
})

const isNumberInput = computed(() => typeof value.value === 'number')

const inputValue = computed({
  get() {
    return `${value.value ?? ''}`
  },
  set(newValue: string) {
    if (isNumberInput.value) {
      const parsed = Number(newValue)
      value.value = Number.isNaN(parsed) ? 0 : parsed
      return
    }

    value.value = newValue
  },
})

const showFileSelect = ref(false)
</script>

<template>
  <div class="flex flex-col w-full">
    <label
      v-if="props.label"
      class="font-bold"
    >
      {{ props.label }}
    </label>
    <div class="relative">
      <input
        v-model="inputValue"
        :type="isNumberInput ? 'number' : 'text'"
        class="w-full"
      >
      <button
        v-if="!isNumberInput"
        type="button"
        class="absolute top-1/2 right-2 -translate-y-1/2 button secondary small"
        @click="showFileSelect = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
    </div>
    <SelectFile
      v-if="!isNumberInput"
      :is-open="showFileSelect"
      @close="showFileSelect = false"
      @select="(filePath: string) => { value = filePath }"
    />
  </div>
</template>
