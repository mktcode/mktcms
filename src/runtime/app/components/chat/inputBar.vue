<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  canSend?: boolean
  disabled?: boolean
  modelValue: string
  placeholder?: string
}>(), {
  canSend: false,
  disabled: false,
  placeholder: 'Ask Website Assistant to build, edit or analyze...',
})

const emit = defineEmits<{
  'send': []
  'update:modelValue': [value: string]
}>()

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')

function syncTextareaHeight(element = textarea.value) {
  if (!element)
    return

  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
}

function onInput(event: Event) {
  const element = event.target as HTMLTextAreaElement
  syncTextareaHeight(element)
  emit('update:modelValue', element.value)
}

watch(() => props.modelValue, async () => {
  await nextTick()
  syncTextareaHeight()
})

onMounted(() => {
  syncTextareaHeight()
})
</script>

<template>
  <div class="flex items-center gap-2 py-2.5 px-3 mx-3 mb-3 bg-white rounded-2xl sticky bottom-3 shadow-ambient md:mx-4 md:mb-4 md:bottom-4">
    <button
      type="button"
      class="self-end flex items-center justify-center size-9 rounded-full bg-transparent border-none cursor-pointer text-ds-on-surface-variant shrink-0 transition-colors hover:bg-ds-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
      tabindex="-1"
      :disabled="props.disabled"
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
          d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
        />
      </svg>
    </button>

    <textarea
      ref="textarea"
      :value="props.modelValue"
      rows="1"
      class="flex-1 bg-transparent! border-none! shadow-none! resize-none py-1.5! px-0! min-h-6 text-sm leading-relaxed text-ds-on-surface outline-none! max-h-56 focus:bg-transparent! focus:shadow-none!"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @input="onInput"
      @keydown.enter.exact.prevent="emit('send')"
    />

    <button
      type="button"
      class="self-end flex items-center justify-center size-10 rounded-full bg-linear-to-br from-ds-primary to-ds-secondary text-ds-on-primary border-none cursor-pointer shrink-0 transition-opacity hover:opacity-85 disabled:opacity-35 disabled:cursor-not-allowed"
      :disabled="!props.canSend"
      @click="emit('send')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="size-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    </button>
  </div>
</template>
