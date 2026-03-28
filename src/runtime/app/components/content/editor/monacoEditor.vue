<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type * as Monaco from 'monaco-editor'

import 'monaco-editor/min/vs/editor/editor.main.css'
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: 'markdown'
  readOnly?: boolean
}>(), {
  language: 'markdown',
  readOnly: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const rootEl = ref<HTMLElement | null>(null)

let editor: Monaco.editor.IStandaloneCodeEditor | undefined
let resizeObserver: ResizeObserver | undefined
let suppressModelEmit = false

function ensureMonacoWorkers() {
  const globalAny = globalThis as any

  if (globalAny.MonacoEnvironment?.getWorker)
    return

  globalAny.MonacoEnvironment = {
    getWorker() {
      return new EditorWorker()
    },
  }
}

onMounted(() => {
  ensureMonacoWorkers()

  if (!rootEl.value)
    return

  editor = monaco.editor.create(rootEl.value, {
    value: props.modelValue ?? '',
    language: props.language,
    readOnly: props.readOnly,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
  })

  editor.onDidChangeModelContent(() => {
    if (!editor || suppressModelEmit)
      return

    emit('update:modelValue', editor.getValue())
  })

  resizeObserver = new ResizeObserver(() => {
    editor?.layout()
  })
  resizeObserver.observe(rootEl.value)

  queueMicrotask(() => {
    editor?.layout()
  })
})

watch(() => props.modelValue, (nextValue) => {
  if (!editor)
    return

  const current = editor.getValue()
  if (nextValue === current)
    return

  suppressModelEmit = true
  editor.setValue(nextValue ?? '')
  suppressModelEmit = false
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined

  editor?.dispose()
  editor = undefined
})
</script>

<template>
  <div
    ref="rootEl"
    class="w-full"
  />
</template>
