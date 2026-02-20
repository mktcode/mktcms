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
  return `[${index}]`
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
</script>

<template>
  <div
    class="flex flex-col gap-2"
    :class="props.depth > 0 ? 'border border-gray-200 rounded-sm p-2' : ''"
  >
    <p
      v-if="props.label"
      class="font-bold"
    >
      {{ props.label }}
    </p>

    <div
      v-if="Array.isArray(frontmatter)"
      v-for="(item, index) in frontmatter"
      :key="index"
      class="flex flex-col gap-2"
    >
      <div class="flex justify-end">
        <button
          type="button"
          class="button secondary small"
          :disabled="frontmatter.length <= 1"
          @click="removeArrayItem(frontmatter, index)"
        >
          Entfernen
        </button>
      </div>

      <FrontmatterToggle
        v-if="isBoolean(item)"
        v-model:value="frontmatter[index]"
        :label="arrayItemLabel(index)"
      />

      <FrontmatterInput
        v-else-if="typeof item === 'string' || isNumber(item)"
        v-model:value="frontmatter[index]"
        :label="arrayItemLabel(index)"
      />

      <FrontmatterForm
        v-else-if="isObject(item) || Array.isArray(item)"
        v-model:frontmatter="frontmatter[index]"
        :label="arrayItemLabel(index)"
        :depth="props.depth + 1"
      />

      <FrontmatterInput
        v-else
        v-model:value="frontmatter[index]"
        :label="arrayItemLabel(index)"
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
      class="flex flex-col gap-2"
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
