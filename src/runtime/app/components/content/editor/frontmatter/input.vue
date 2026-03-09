<script setup lang="ts">
import { computed, ref } from 'vue'
import FilePickerModal from './filePicker/modal.vue'

const props = withDefaults(defineProps<{
  label?: string
  inputType?: 'text' | 'number' | 'date' | 'datetime-local'
  uiHint?: 'image' | 'pdf' | 'file'
  selectMode?: 'single' | 'multiple'
  selectOptions?: Array<{ label: string, value: string | number }>
}>(), {
  label: '',
  inputType: 'text',
  uiHint: undefined,
  selectMode: undefined,
  selectOptions: () => [],
})

const value = defineModel<string | number | Array<string | number>>('value', {
  required: true,
})

const isPickerOpen = ref(false)

const hasSelectInput = computed(() => props.selectMode === 'single' || props.selectMode === 'multiple')

const resolvedInputType = computed(() => {
  if (props.inputType !== 'text') {
    return props.inputType
  }

  return typeof value.value === 'number' ? 'number' : 'text'
})

const isNumberInput = computed(() => resolvedInputType.value === 'number')

function normalizeOptionValue(optionValue: string): string | number {
  for (const option of props.selectOptions) {
    if (String(option.value) === optionValue) {
      return option.value
    }
  }

  return optionValue
}

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

const singleSelectValue = computed({
  get() {
    if (Array.isArray(value.value)) {
      return value.value.length > 0 ? String(value.value[0]) : ''
    }

    return `${value.value ?? ''}`
  },
  set(newValue: string) {
    value.value = normalizeOptionValue(newValue)
  },
})

function isMultipleOptionSelected(optionValue: string | number): boolean {
  if (!Array.isArray(value.value)) {
    return false
  }

  return value.value.some(selected => String(selected) === String(optionValue))
}

function toggleMultipleOption(optionValue: string | number, isChecked: boolean) {
  const normalizedValue = normalizeOptionValue(String(optionValue))
  const currentValues = Array.isArray(value.value) ? [...value.value] : []

  if (isChecked) {
    if (!currentValues.some(selected => String(selected) === String(normalizedValue))) {
      currentValues.push(normalizedValue)
    }
  }
  else {
    const nextValues = currentValues.filter(selected => String(selected) !== String(normalizedValue))
    value.value = nextValues
    return
  }

  value.value = currentValues
}

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

    <select
      v-if="hasSelectInput && props.selectMode === 'single'"
      v-model="singleSelectValue"
      class="w-full"
    >
      <option
        v-for="option in props.selectOptions"
        :key="`${option.value}`"
        :value="`${option.value}`"
      >
        {{ option.label }}
      </option>
    </select>

    <div
      v-else-if="hasSelectInput && props.selectMode === 'multiple'"
      class="flex flex-col gap-2 w-full"
    >
      <label
        v-for="option in props.selectOptions"
        :key="`${option.value}`"
        class="inline-flex items-center gap-2"
      >
        <input
          type="checkbox"
          :checked="isMultipleOptionSelected(option.value)"
          @change="toggleMultipleOption(option.value, ($event.target as HTMLInputElement).checked)"
        >
        {{ option.label }}
      </label>
    </div>

    <div
      v-else
      class="flex items-center gap-2"
    >
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
