<script setup lang="ts">
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

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="chat-input-bar">
    <button
      type="button"
      class="chat-input-icon"
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
      :value="props.modelValue"
      rows="1"
      class="chat-input-textarea"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @input="onInput"
      @keydown.enter.exact.prevent="emit('send')"
    />

    <button
      type="button"
      class="chat-send-button"
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
