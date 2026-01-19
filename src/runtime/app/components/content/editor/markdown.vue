<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked, type Tokens } from 'marked'
import useSaveContent from '../../../composables/useSaveContent'
import Saved from '../saved.vue'

const { content, saveContent, isSaving, savingSuccessful } = await useSaveContent()

const mode = ref<'edit' | 'preview'>('edit')

function escapeHtml(value: string): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isSafeHref(href: string): boolean {
  const h = (href ?? '').trim()
  if (!h) return false
  if (h.startsWith('#') || h.startsWith('/') || h.startsWith('./') || h.startsWith('../')) return true
  try {
    const url = new URL(h)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  }
  catch {
    return false
  }
}

const renderedHtml = computed(() => {
  const renderer = new marked.Renderer()

  // Do not render raw HTML from markdown.
  renderer.html = (token: Tokens.HTML | Tokens.Tag) => escapeHtml(token.text)

  renderer.link = function (token: Tokens.Link) {
    const safe = token.href && isSafeHref(token.href) ? token.href : ''
    const text = this.parser.parseInline(token.tokens)
    if (!safe) return text

    const t = token.title ? ` title="${escapeHtml(token.title)}"` : ''
    const target = ' target="_blank" rel="noopener noreferrer"'
    return `<a href="${escapeHtml(safe)}"${t}${target}>${text}</a>`
  }

  renderer.image = function (token: Tokens.Image) {
    const safe = token.href && isSafeHref(token.href) ? token.href : ''
    if (!safe) return escapeHtml(token.text)
    const alt = escapeHtml(token.text)
    const t = token.title ? ` title="${escapeHtml(token.title)}"` : ''
    return `<img src="${escapeHtml(safe)}" alt="${alt}"${t} />`
  }

  return marked.parse(content.value ?? '', {
    renderer,
    gfm: true,
    breaks: true,
  }) as string
})
</script>

<template>
  <div>
    <div class="flex gap-2 mb-2">
      <button
        type="button"
        class="button secondary flex-1"
        :disabled="mode === 'edit'"
        @click="mode = 'edit'"
      >
        Bearbeiten
      </button>
      <button
        type="button"
        class="button secondary flex-1"
        :disabled="mode === 'preview'"
        @click="mode = 'preview'"
      >
        Vorschau
      </button>
    </div>

    <textarea
      v-if="mode === 'edit'"
      v-model="content"
      class="w-full min-h-72"
    />

    <div
      v-else
      class="prose max-w-full min-h-72 border border-gray-200 rounded-sm p-4"
      v-html="renderedHtml"
    />

    <button
      type="button"
      class="button w-full justify-center mt-3"
      @click="saveContent"
    >
      <span v-if="isSaving">Speichern...</span>
      <span v-else>Speichern</span>
    </button>
    <Saved v-if="savingSuccessful" />
  </div>
</template>
