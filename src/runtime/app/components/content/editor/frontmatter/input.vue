<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  inputType?: 'text' | 'number' | 'date' | 'datetime-local'
}>(), {
  label: '',
  inputType: 'text',
})

const value = defineModel<string | number>('value', {
  required: true,
})

const resolvedInputType = computed(() => {
  if (props.inputType !== 'text') {
    return props.inputType
  }

  return typeof value.value === 'number' ? 'number' : 'text'
})

const isNumberInput = computed(() => resolvedInputType.value === 'number')

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
</script>

<template>
  <div class="flex flex-col w-full">
    <label
      v-if="props.label"
      class="font-bold"
    >
      {{ props.label }}
    </label>
    <input
      v-model="inputValue"
      :type="resolvedInputType"
      class="w-full"
    >
  </div>
</template>
