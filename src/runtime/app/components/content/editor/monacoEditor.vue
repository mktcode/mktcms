<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TurndownService from 'turndown'
import type * as Monaco from 'monaco-editor'
import FilePickerModal from './frontmatter/filePicker/modal.vue'
import { isImagePath } from '../../../../shared/contentFiles'

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
const isFilePickerOpen = ref(false)
const isContextMenuOpen = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

let editor: Monaco.editor.IStandaloneCodeEditor | undefined
let pendingFileInsertionSelection: Monaco.Selection | undefined
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

function insertMarkdown(markdown: string, selections = editor?.getSelections()) {
  if (!editor || !selections?.length)
    return

  editor.pushUndoStop()
  editor.executeEdits('insert-markdown', selections.map(selection => ({
    range: selection,
    text: markdown,
    forceMoveMarkers: true,
  })))
  editor.pushUndoStop()
  editor.focus()
}

function escapeMarkdownLabel(label: string) {
  return label
    .replaceAll('\\', '\\\\')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
}

function filenameWithoutExtension(path: string) {
  const filename = path.split(':').at(-1) ?? path

  return filename.replace(/\.[^/.]+$/, '')
}

function toContentUrl(path: string) {
  return `/api/content/${encodeURIComponent(path)}`
}

function selectedText(selection: Monaco.Selection) {
  return editor?.getModel()?.getValueInRange(selection) ?? ''
}

function linkLabelFromSelection(selection: Monaco.Selection | undefined) {
  if (!selection || selection.isEmpty())
    return undefined

  const text = selectedText(selection).replace(/\s+/g, ' ').trim()

  return text || undefined
}

function toMarkdownLinkDestination(url: string) {
  return `<${url.replaceAll('>', '%3E')}>`
}

function toMarkdownFileReference(path: string, customLabel?: string) {
  const label = escapeMarkdownLabel(customLabel ?? filenameWithoutExtension(path))
  const url = toMarkdownLinkDestination(toContentUrl(path))

  if (isImagePath(path))
    return `![${label}](${url})`

  return `[${label}](${url})`
}

function closeContextMenu() {
  isContextMenuOpen.value = false
}

function openFilePicker() {
  closeContextMenu()
  isFilePickerOpen.value = true
}

function insertSelectedFile(path: string) {
  const label = linkLabelFromSelection(pendingFileInsertionSelection)
  insertMarkdown(toMarkdownFileReference(path, label), pendingFileInsertionSelection ? [pendingFileInsertionSelection] : undefined)
  pendingFileInsertionSelection = undefined
}

function isSafeMarkdownHref(href: string) {
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

function contextSelection() {
  return pendingFileInsertionSelection ?? editor?.getSelection() ?? undefined
}

function contextSelectionText(placeholder: string) {
  const selection = contextSelection()
  if (!selection || selection.isEmpty())
    return placeholder

  return selectedText(selection) || placeholder
}

function insertAtContextSelection(markdown: string) {
  const selection = contextSelection()
  insertMarkdown(markdown, selection ? [selection] : undefined)
  pendingFileInsertionSelection = undefined
}

function addLinkToSelection() {
  const label = linkLabelFromSelection(contextSelection()) ?? 'Linktext'

  closeContextMenu()

  const href = window.prompt('Link eingeben')?.trim()
  if (!href)
    return

  if (!isSafeMarkdownHref(href)) {
    window.alert('Bitte einen gültigen Link eingeben.')
    return
  }

  insertAtContextSelection(`[${escapeMarkdownLabel(label)}](${toMarkdownLinkDestination(href)})`)
}

function addHeadingToSelection() {
  const text = contextSelectionText('Überschrift')
  const markdown = text
    .split(/\r?\n/)
    .map((line) => {
      const headingText = line.replace(/^\s*#{1,6}\s*/, '').trim()

      return headingText ? `## ${headingText}` : line
    })
    .join('\n')

  closeContextMenu()
  insertAtContextSelection(markdown)
}

function addBoldToSelection() {
  closeContextMenu()
  insertAtContextSelection(`**${contextSelectionText('Text')}**`)
}

function addItalicToSelection() {
  closeContextMenu()
  insertAtContextSelection(`*${contextSelectionText('Text')}*`)
}

function addListToSelection() {
  const text = contextSelectionText('Listenpunkt')
  const markdown = text
    .split(/\r?\n/)
    .map((line) => {
      const listItemText = line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim()

      return listItemText ? `- ${listItemText}` : line
    })
    .join('\n')

  closeContextMenu()
  insertAtContextSelection(markdown)
}

function addNumberedListToSelection() {
  const text = contextSelectionText('Listenpunkt')
  const markdown = text
    .split(/\r?\n/)
    .map((line, index) => {
      const listItemText = line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim()

      return listItemText ? `${index + 1}. ${listItemText}` : line
    })
    .join('\n')

  closeContextMenu()
  insertAtContextSelection(markdown)
}

function getMouseTargetPosition(event: MouseEvent) {
  const target = editor?.getTargetAtClientPoint(event.clientX, event.clientY)

  if (target && 'position' in target && target.position)
    return target.position

  return undefined
}

function handleContextMenu(event: MouseEvent) {
  if (!editor || !rootEl.value?.contains(event.target as Node))
    return

  event.preventDefault()
  event.stopPropagation()

  const position = getMouseTargetPosition(event)
  const currentSelection = editor.getSelection() ?? undefined
  const shouldKeepSelection = !!position
    && !!currentSelection
    && !currentSelection.isEmpty()
    && monaco.Range.containsPosition(currentSelection, position)

  if (shouldKeepSelection) {
    pendingFileInsertionSelection = currentSelection
  }
  else if (position) {
    pendingFileInsertionSelection = new monaco.Selection(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column,
    )
    editor.setPosition(position)
  }
  else {
    pendingFileInsertionSelection = currentSelection
  }

  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY,
  }
  isContextMenuOpen.value = true
}

function handleDocumentClick(event: MouseEvent) {
  if (!isContextMenuOpen.value)
    return

  const target = event.target as HTMLElement
  if (target.closest('[data-monaco-custom-context-menu]'))
    return

  closeContextMenu()
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    closeContextMenu()
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
    contextmenu: false,
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
  document.addEventListener('contextmenu', handleContextMenu, true)
  document.addEventListener('click', handleDocumentClick, true)
  document.addEventListener('keydown', handleDocumentKeydown, true)

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
  document.removeEventListener('contextmenu', handleContextMenu, true)
  document.removeEventListener('click', handleDocumentClick, true)
  document.removeEventListener('keydown', handleDocumentKeydown, true)

  editor?.dispose()
  editor = undefined
})
</script>

<template>
  <div class="relative w-full h-full">
    <div
      ref="rootEl"
      class="w-full h-full"
    />

    <div
      v-if="isContextMenuOpen"
      data-monaco-custom-context-menu
      class="mktcms-editor-context-menu fixed z-9999"
      :style="{
        left: `${contextMenuPosition.x}px`,
        top: `${contextMenuPosition.y}px`,
      }"
      role="menu"
    >
      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="addLinkToSelection"
      >
        <span class="mktcms-editor-context-menu-icon">↗</span>
        <span>Link hinzufügen</span>
      </button>

      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="addHeadingToSelection"
      >
        <span class="mktcms-editor-context-menu-icon text-xs font-bold">H2</span>
        <span>Überschrift</span>
      </button>

      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="addBoldToSelection"
      >
        <span class="mktcms-editor-context-menu-icon font-bold">B</span>
        <span>Fett</span>
      </button>

      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="addItalicToSelection"
      >
        <span class="mktcms-editor-context-menu-icon italic">I</span>
        <span>Kursiv</span>
      </button>

      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="addListToSelection"
      >
        <span class="mktcms-editor-context-menu-icon">•</span>
        <span>Aufzählung</span>
      </button>

      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="addNumberedListToSelection"
      >
        <span class="mktcms-editor-context-menu-icon text-xs font-medium">1.</span>
        <span>Nummerierte Liste</span>
      </button>

      <div class="mktcms-editor-context-menu-divider" />

      <button
        type="button"
        class="mktcms-editor-context-menu-button"
        role="menuitem"
        @click="openFilePicker"
      >
        <span class="mktcms-editor-context-menu-icon">📎</span>
        <span>Datei auswählen</span>
      </button>
    </div>

    <FilePickerModal
      :is-open="isFilePickerOpen"
      ui-hint="media"
      @close="isFilePickerOpen = false"
      @select="insertSelectedFile"
    />
  </div>
</template>

<style scoped>
.mktcms-editor-context-menu {
  min-width: 16rem;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: 0.75rem;
  box-shadow: 0 12px 32px rgb(0 0 0 / 22%);
}

.mktcms-editor-context-menu-button {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: left;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease;
}

.mktcms-editor-context-menu-button:hover {
  background: #f3f4f6;
}

.mktcms-editor-context-menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 1.75rem;
  width: 1.75rem;
  min-width: 1.75rem;
  max-width: 1.75rem;
  height: 1.75rem;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-family: var(--font-sans);
}

.mktcms-editor-context-menu-button:hover .mktcms-editor-context-menu-icon {
  background: #fff;
}

.mktcms-editor-context-menu-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #f3f4f6;
}
</style>
