<script setup lang="ts">
import FrontmatterInput from './input.vue'

defineOptions({
  name: 'FrontmatterForm',
})

const props = withDefaults(defineProps<{
  depth?: number
}>(), {
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

function objectKeys(value: Record<string, any>) {
  return Object.keys(value)
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

  const lastItem = arrayRef[arrayRef.length - 1]
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
    <template v-if="Array.isArray(frontmatter)">
      <div
        v-for="(item, index) in frontmatter"
        :key="index"
        class="flex flex-col gap-2"
      >
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="button secondary small"
            :disabled="frontmatter.length <= 1"
            @click="removeArrayItem(frontmatter, index)"
          >
            Entfernen
          </button>
        </div>

        <div v-if="isBoolean(item)">
          <label class="inline-flex items-center">
            <input
              v-model="frontmatter[index]"
              type="checkbox"
              class="mr-2"
            >
          </label>
        </div>

        <FrontmatterInput
          v-else-if="typeof item === 'string' || isNumber(item)"
          v-model:value="frontmatter[index]"
          label=""
        />

        <FrontmatterForm
          v-else-if="isObject(item) || Array.isArray(item)"
          v-model:frontmatter="frontmatter[index]"
          label=""
          :depth="props.depth + 1"
        />

        <FrontmatterInput
          v-else
          v-model:value="frontmatter[index]"
          label=""
        />
      </div>

      <button
        type="button"
        class="button secondary small self-start"
        @click="addArrayItem(frontmatter)"
      >
        Element hinzufügen
      </button>
    </template>

    <template v-else>
      <div
        v-for="key in objectKeys(frontmatter)"
        :key="key"
        class="flex flex-col gap-1"
      >
        <label
          v-if="isBoolean(frontmatter[key])"
          class="w-full inline-flex items-center font-bold text-sm"
        >
          <input
            v-model="frontmatter[key]"
            type="checkbox"
            class="mr-2"
          >
          <span>{{ key }}</span>
        </label>

        <p
          v-else
          class="font-bold"
          :class="{
            'text-[18px]': props.depth === 0,
            'text-[15px]': props.depth === 1,
            'text-[12px]': props.depth >= 2,
          }"
        >
          {{ key }}
        </p>

        <FrontmatterInput
          v-if="!isBoolean(frontmatter[key]) && (typeof frontmatter[key] === 'string' || isNumber(frontmatter[key]))"
          v-model:value="frontmatter[key]"
        />

        <FrontmatterForm
          v-else-if="!isBoolean(frontmatter[key]) && (isObject(frontmatter[key]) || Array.isArray(frontmatter[key]))"
          v-model:frontmatter="frontmatter[key]"
          label=""
          :depth="props.depth + 1"
        />

        <FrontmatterInput
          v-else-if="!isBoolean(frontmatter[key])"
          v-model:value="frontmatter[key]"
        />
      </div>
    </template>
  </div>
</template>
