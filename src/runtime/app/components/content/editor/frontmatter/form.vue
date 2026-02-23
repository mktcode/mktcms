<script setup lang="ts">
import { reactive } from 'vue'
import FrontmatterInput from './input.vue'

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

const openState = reactive<Record<string, boolean>>({})

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

function moveArrayItem(arrayRef: any[], from: number, to: number) {
  if (to < 0 || to >= arrayRef.length || from === to) {
    return
  }

  const [item] = arrayRef.splice(from, 1)
  arrayRef.splice(to, 0, item)
}

function arrayItemStateKey(index: number) {
  return `array-${index}`
}

function objectItemStateKey(key: string) {
  return `object-${key}`
}

function isOpen(key: string) {
  if (typeof openState[key] === 'undefined') {
    openState[key] = false
  }

  return openState[key]
}

function toggleOpen(key: string) {
  openState[key] = !isOpen(key)
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
      class="flex flex-col gap-0 border border-gray-200 rounded-sm bg-white/50 overflow-hidden"
    >
      <div class="flex items-center justify-between gap-2 px-3 py-2">
        <button
          v-if="!isBoolean(item)"
          type="button"
          class="flex-1 flex items-center gap-2 min-w-0 text-left rounded-sm px-2 py-1 transition-colors duration-200 hover:bg-gray-200/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
          :aria-expanded="isOpen(arrayItemStateKey(index))"
          @click="toggleOpen(arrayItemStateKey(index))"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4 transition-transform duration-300"
            :class="{ 'rotate-180': isOpen(arrayItemStateKey(index)) }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
          <span class="font-bold text-sm">{{ arrayItemLabel(index) }}</span>
        </button>

        <div
          v-else
          class="flex-1 min-w-0 px-2 py-1"
        >
          <span class="font-bold text-sm">{{ arrayItemLabel(index) }}</span>
        </div>

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

      <div
        v-if="isBoolean(item)"
        class="px-3 pb-3"
      >
        <label class="inline-flex items-center">
          <input
            v-model="frontmatter[index]"
            type="checkbox"
            class="mr-2"
          >
        </label>
      </div>

      <div
        v-else
        class="grid transition-[grid-template-rows] duration-300 ease-in-out"
        :class="isOpen(arrayItemStateKey(index)) ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden px-3 pb-3">
          <FrontmatterInput
            v-if="typeof item === 'string' || isNumber(item)"
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
      </div>
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
      class="flex flex-col gap-0 border border-gray-200 rounded-sm bg-white/45 overflow-hidden"
    >
      <label
        v-if="isBoolean(frontmatter[key])"
        class="w-full inline-flex items-center px-3 py-2 font-bold text-sm"
      >
        <input
          v-model="frontmatter[key]"
          type="checkbox"
          class="mr-2"
        >
        <span>{{ key }}</span>
      </label>

      <button
        v-else
        type="button"
        class="w-full flex items-center gap-2 min-w-0 text-left px-3 py-2 transition-colors duration-200 hover:bg-gray-200/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
        :aria-expanded="isOpen(objectItemStateKey(key))"
        @click="toggleOpen(objectItemStateKey(key))"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen(objectItemStateKey(key)) }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
        <span class="font-bold text-sm">{{ key }}</span>
      </button>

      <div
        v-if="!isBoolean(frontmatter[key])"
        class="grid transition-[grid-template-rows] duration-300 ease-in-out"
        :class="isOpen(objectItemStateKey(key)) ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden px-3 pb-3">
          <FrontmatterInput
            v-if="typeof frontmatter[key] === 'string' || isNumber(frontmatter[key])"
            v-model:value="frontmatter[key]"
          />

          <FrontmatterForm
            v-else-if="isObject(frontmatter[key]) || Array.isArray(frontmatter[key])"
            v-model:frontmatter="frontmatter[key]"
            label=""
            :depth="props.depth + 1"
          />

          <FrontmatterInput
            v-else
            v-model:value="frontmatter[key]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
