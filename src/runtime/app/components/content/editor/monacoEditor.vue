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

const THEME_NAME = 'mktcms-light'

function defineEditorTheme() {
  monaco.editor.defineTheme(THEME_NAME, {
    base: 'vs',
    inherit: true,
    rules: [
      // Markdown headings (the # markers are tokenised as "keyword")
      { token: 'keyword', foreground: '506169', fontStyle: 'bold' },
      // Bold / italic marker characters
      { token: 'variable', foreground: '6b7d85' },
      // Emphasised text
      { token: 'emphasis', foreground: '526073', fontStyle: 'italic' },
      { token: 'strong', foreground: '2a3439', fontStyle: 'bold' },
      // Links & URLs
      { token: 'string.link', foreground: '506169' },
      { token: 'string', foreground: '526073' },
      // Inline code / fenced-block language tag
      { token: 'variable.source', foreground: '526073' },
      { token: 'type', foreground: '526073' },
      // HTML inside markdown
      { token: 'tag', foreground: '506169' },
      { token: 'attribute.name', foreground: '6b7d85' },
      { token: 'attribute.value', foreground: '526073' },
      // Comments
      { token: 'comment', foreground: 'a9b4b9', fontStyle: 'italic' },
      // Numbers
      { token: 'number', foreground: '506169' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#2a3439',
      'editor.lineHighlightBackground': '#f7f9fb',
      'editor.lineHighlightBorder': '#00000000',
      'editor.selectionBackground': '#c6d7e180',
      'editor.inactiveSelectionBackground': '#e1e9ee60',
      'editorCursor.foreground': '#506169',
      'editorLineNumber.foreground': '#a9b4b9',
      'editorLineNumber.activeForeground': '#6b7d85',
      'editorIndentGuide.background': '#e8eef2',
      'editorWhitespace.foreground': '#e1e9ee',
      'editorWidget.background': '#f7f9fb',
      'editorWidget.border': '#e8eef2',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#c6d7e140',
      'scrollbarSlider.hoverBackground': '#a9b4b960',
      'scrollbarSlider.activeBackground': '#a9b4b980',
    },
  })
}

onMounted(() => {
  ensureMonacoWorkers()
  defineEditorTheme()

  if (!rootEl.value)
    return

  editor = monaco.editor.create(rootEl.value, {
    value: props.modelValue ?? '',
    language: props.language,
    readOnly: props.readOnly,
    theme: THEME_NAME,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    padding: { top: 12 },
    fontFamily: '\'Inter\', ui-sans-serif, system-ui, sans-serif',
    fontSize: 14,
    lineHeight: 22,
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
