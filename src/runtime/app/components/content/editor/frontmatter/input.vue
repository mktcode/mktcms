<script setup lang="ts">
import { computed, ref } from 'vue'
import FilePickerModal from './filePicker/modal.vue'

const props = withDefaults(defineProps<{
  label?: string
  inputType?: 'text' | 'number' | 'date' | 'datetime-local'
  uiHint?: 'image' | 'pdf' | 'file'
}>(), {
  label: '',
  inputType: 'text',
  uiHint: undefined,
})

const value = defineModel<string | number>('value', {
  required: true,
})

const isPickerOpen = ref(false)

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

const pickerButtonLabel = computed(() => {
  if (props.uiHint === 'image') {
    return 'Bild auswählen'
  }

  if (props.uiHint === 'pdf') {
    return 'PDF auswählen'
  }

  if (props.uiHint === 'file') {
    return 'Datei auswählen'
  }

  return ''
})

function onPickerSelect(path: string) {
  value.value = path
}
</script>

<template>
  <div class="flex flex-col w-full">
    <label
      v-if="props.label"
      class="font-bold"
    >
      {{ props.label }}
    </label>
    <div class="flex items-center gap-2">
      <input
        v-model="inputValue"
        :type="resolvedInputType"
        class="w-full"
      >

      <button
        v-if="props.uiHint"
        type="button"
        class="button secondary small whitespace-nowrap"
        @click="isPickerOpen = true"
      >
        {{ pickerButtonLabel }}
      </button>
    </div>

    <FilePickerModal
      v-if="props.uiHint"
      :is-open="isPickerOpen"
      :ui-hint="props.uiHint"
      @close="isPickerOpen = false"
      @select="onPickerSelect"
    />
  </div>
</template>
