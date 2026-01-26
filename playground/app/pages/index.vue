<script setup lang="ts">
const siteUrl = useSiteUrl()

const md = await useMdContent('default.md')
</script>

<template>
  <h1>Welcome to MKT CMS</h1>

  <div v-if="md">
    <h2>Markdown Content</h2>
    <img
      :src="`${siteUrl}/api/content/${md.frontmatter.Bild.replace(/\//g, ':')}`"
      alt="Bild aus Frontmatter"
      style="max-width: 200px;"
    >
    <MDC
      :value="md.markdown"
      tag="article"
      class="prose max-w-none"
    />
  </div>
</template>
