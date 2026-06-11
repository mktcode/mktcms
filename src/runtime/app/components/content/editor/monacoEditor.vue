<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TurndownService from 'turndown'
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

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

// Office/LibreOffice clipboard HTML often contains document CSS like
// `@page { ... } p { ... }` inside <style> tags. Turndown would otherwise
// turn that CSS text into Markdown, so drop non-content tags before converting.
turndownService.remove(['style', 'script', 'meta', 'link'])

function insertMarkdown(markdown: string) {
  if (!editor)
    return

  const selections = editor.getSelections()
  if (!selections?.length)
    return

  editor.pushUndoStop()
  editor.executeEdits('paste-html-as-markdown', selections.map(selection => ({
    range: selection,
    text: markdown,
    forceMoveMarkers: true,
  })))
  editor.pushUndoStop()
  editor.focus()
}

function handlePaste(event: ClipboardEvent) {
  if (!editor?.hasTextFocus())
    return

  const html = event.clipboardData?.getData('text/html')
  if (!html)
    return

  const markdown = turndownService.turndown(html).trim()
  if (!markdown)
    return

  event.preventDefault()
  event.stopPropagation()

  insertMarkdown(markdown)
}

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

  // Monaco handles paste on an internal textarea, which might not dispatch
  // through the component root. Listen at document capture phase so we see the
  // raw ClipboardEvent before Monaco consumes it.
  document.addEventListener('paste', handlePaste, true)

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

  document.removeEventListener('paste', handlePaste, true)

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
