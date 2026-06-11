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

const allowedPasteElementNames = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'li',
  'ol',
  'p',
  'strong',
  'ul',
])

const removablePasteElementNames = new Set([
  'applet',
  'area',
  'audio',
  'button',
  'canvas',
  'caption',
  'col',
  'colgroup',
  'embed',
  'figcaption',
  'figure',
  'form',
  'hr',
  'iframe',
  'img',
  'input',
  'link',
  'map',
  'math',
  'meta',
  'noscript',
  'object',
  'option',
  'picture',
  'script',
  'select',
  'source',
  'style',
  'svg',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'video',
])

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

// Some unwanted tags have built-in Turndown rules, e.g. <img> -> ![](src).
// Add a higher-priority removal rule as a safety net in addition to sanitizing
// the pasted HTML before conversion.
turndownService.addRule('removeUnsupportedPasteElements', {
  filter: node => removablePasteElementNames.has(node.nodeName.toLowerCase()) || node.nodeName.includes(':'),
  replacement: () => '',
})

function unwrapElement(element: Element) {
  const parent = element.parentNode
  if (!parent)
    return

  while (element.firstChild)
    parent.insertBefore(element.firstChild, element)

  parent.removeChild(element)
}

function isSafeHref(href: string) {
  if (!href.trim())
    return false

  try {
    const url = new URL(href, window.location.origin)

    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  }
  catch {
    return false
  }
}

function sanitizePastedHtml(html: string) {
  const clipboardDocument = new DOMParser().parseFromString(html, 'text/html')

  const comments = clipboardDocument.createTreeWalker(clipboardDocument.body, NodeFilter.SHOW_COMMENT)
  const commentsToRemove: Comment[] = []
  while (comments.nextNode())
    commentsToRemove.push(comments.currentNode as Comment)

  for (const comment of commentsToRemove)
    comment.remove()

  const elements = Array.from(clipboardDocument.body.querySelectorAll('*'))
  for (const element of elements) {
    if (!element.isConnected)
      continue

    const tagName = element.tagName.toLowerCase()
    const inlineStyle = element.getAttribute('style') ?? ''

    if (/display\s*:\s*none/i.test(inlineStyle) || /mso-hide\s*:\s*all/i.test(inlineStyle)) {
      element.remove()
      continue
    }

    if (tagName.includes(':') || removablePasteElementNames.has(tagName)) {
      element.remove()
      continue
    }

    if (tagName === 'a') {
      const href = element.getAttribute('href') ?? ''
      if (!isSafeHref(href)) {
        unwrapElement(element)
        continue
      }

      for (const attribute of Array.from(element.attributes)) {
        if (attribute.name !== 'href')
          element.removeAttribute(attribute.name)
      }

      continue
    }

    if (!allowedPasteElementNames.has(tagName)) {
      unwrapElement(element)
      continue
    }

    for (const attribute of Array.from(element.attributes))
      element.removeAttribute(attribute.name)
  }

  return clipboardDocument.body
}

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

  const markdown = turndownService.turndown(sanitizePastedHtml(html)).trim()
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
