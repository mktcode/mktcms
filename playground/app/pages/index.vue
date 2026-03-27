<script setup lang="ts">
const siteUrl = useSiteUrl()

const md = await useMdContent('Home.md')
const txt = await useTxtContent('Title.txt')

const imagePaths = await useImagePaths()
</script>

<template>
  <h1>{{ txt }}</h1>

  <img
    v-for="path in imagePaths"
    :key="path"
    :src="`${siteUrl}/api/content/${path}`"
    :alt="`Image at ${path}`"
  >

  <AdminWidget>
    <NuxtLink
      to="/admin/edit/markdown/Home.md"
      target="_blank"
    >
      Go to Admin Panel
    </NuxtLink>
  </AdminWidget>

  <div v-if="md">
    <h2>Markdown Content</h2>
    <img
      :src="`${siteUrl}${md.frontmatter.Bild}`"
      alt="Bild aus Frontmatter"
    >
    <MDC
      :value="md.markdown"
      tag="article"
      class="prose max-w-none"
    />
  </div>
</template>
