<script setup lang="ts">
import FrontmatterInput from './input.vue'
import FrontmatterToggle from './toggle.vue'

defineOptions({
  name: 'FrontmatterForm',
})

const props = withDefaults(defineProps<{
  label?: string
  depth?: number
}>(), {
  label: '',
  depth: 0,
})

const frontmatter = defineModel<any>('frontmatter', {
  required: true,
})

function isBoolean(value: unknown) {
  return typeof value === 'boolean'
}

function isNumber(value: unknown) {
  return typeof value === 'number'
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function arrayItemLabel(index: number) {
  return `Element ${index + 1}`
}

function objectKeys(value: Record<string, any>) {
  return Object.keys(value)
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function createEmptyLike(value: any): any {
  if (Array.isArray(value)) {
    return []
  }

  if (isObject(value)) {
    const next: Record<string, any> = {}

    for (const key of Object.keys(value)) {
      next[key] = createEmptyLike(value[key])
    }

    return next
  }

  if (isBoolean(value)) {
    return false
  }

  if (isNumber(value)) {
    return 0
  }

  return ''
}

function addArrayItem(arrayRef: any[]) {
  if (arrayRef.length === 0) {
    arrayRef.push('')
    return
  }

  const lastItem = cloneValue(arrayRef[arrayRef.length - 1])
  arrayRef.push(createEmptyLike(lastItem))
}

function removeArrayItem(arrayRef: any[], index: number) {
  if (arrayRef.length <= 1) {
    return
  }

  arrayRef.splice(index, 1)
}

function moveArrayItem(arrayRef: any[], from: number, to: number) {
  if (to < 0 || to >= arrayRef.length || from === to) {
    return
  }

  const [item] = arrayRef.splice(from, 1)
  arrayRef.splice(to, 0, item)
}
</script>

<template>
  <div
    class="flex flex-col gap-3"
    :class="{
      'border border-gray-200 rounded-sm p-3': props.depth > 0,
      'bg-gray-100/30': props.depth === 1,
      'bg-gray-100/50': props.depth === 2,
      'bg-gray-100/70': props.depth === 3,
      'bg-gray-100/80': props.depth === 4,
      'bg-gray-100/90': props.depth >= 5,
    }"
  >
    <p
      v-if="props.label"
      class="font-bold text-[15px]"
    >
      {{ props.label }}
    </p>

    <div
      v-if="Array.isArray(frontmatter)"
      v-for="(item, index) in frontmatter"
      :key="index"
      class="flex flex-col gap-3 border border-gray-200 rounded-sm p-3 bg-white/50"
    >
      <div class="flex items-center justify-between gap-2">
        <p class="font-bold text-sm">
          {{ arrayItemLabel(index) }}
        </p>

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="button secondary small"
            :disabled="index === 0"
            @click="moveArrayItem(frontmatter, index, index - 1)"
          >
            ↑
          </button>

          <button
            type="button"
            class="button secondary small"
            :disabled="index === frontmatter.length - 1"
            @click="moveArrayItem(frontmatter, index, index + 1)"
          >
            ↓
          </button>

          <button
            type="button"
            class="button secondary small"
            :disabled="frontmatter.length <= 1"
            @click="removeArrayItem(frontmatter, index)"
          >
            Entfernen
          </button>
        </div>
      </div>

      <FrontmatterToggle
        v-if="isBoolean(item)"
        v-model:value="frontmatter[index]"
        label="Wert"
      />

      <FrontmatterInput
        v-else-if="typeof item === 'string' || isNumber(item)"
        v-model:value="frontmatter[index]"
        label="Wert"
      />

      <FrontmatterForm
        v-else-if="isObject(item) || Array.isArray(item)"
        v-model:frontmatter="frontmatter[index]"
        label="Wert"
        :depth="props.depth + 1"
      />

      <FrontmatterInput
        v-else
        v-model:value="frontmatter[index]"
        label="Wert"
      />
    </div>

    <button
      v-if="Array.isArray(frontmatter)"
      type="button"
      class="button secondary small self-start"
      @click="addArrayItem(frontmatter)"
    >
      Element hinzufügen
    </button>

    <div
      v-else
      v-for="key in objectKeys(frontmatter)"
      :key="key"
      class="flex flex-col gap-2 border border-gray-200 rounded-sm p-3 bg-white/45"
    >
      <FrontmatterToggle
        v-if="isBoolean(frontmatter[key])"
        v-model:value="frontmatter[key]"
        :label="key"
      />

      <FrontmatterInput
        v-else-if="typeof frontmatter[key] === 'string' || isNumber(frontmatter[key])"
        v-model:value="frontmatter[key]"
        :label="key"
      />

      <FrontmatterForm
        v-else-if="isObject(frontmatter[key]) || Array.isArray(frontmatter[key])"
        v-model:frontmatter="frontmatter[key]"
        :label="key"
        :depth="props.depth + 1"
      />

      <FrontmatterInput
        v-else
        v-model:value="frontmatter[key]"
        :label="key"
      />
    </div>
  </div>
</template>
