<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked, type Tokens } from 'marked'

const content = defineModel<string>('content', { default: '' })

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
    const target = safe.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
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
  <div style="width: 100%;">
    <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
      <button
        type="button"
        class="button"
        @click="mode = mode === 'edit' ? 'preview' : 'edit'"
      >
        {{ mode === 'edit' ? 'Vorschau' : 'Bearbeiten' }}
      </button>
    </div>

    <textarea
      v-if="mode === 'edit'"
      v-model="content"
      style="width: 100%; height: 400px; resize: vertical; border: 1px solid #d0d0d0; padding: 10px; box-sizing: border-box;"
    />

    <div
      v-else
      style="width: 100%; min-height: 400px; border: 1px solid #d0d0d0; padding: 10px; box-sizing: border-box; overflow: auto;"
      v-html="renderedHtml"
    />
  </div>
</template>
