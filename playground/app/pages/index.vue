<script setup lang="ts">
const siteUrl = useSiteUrl()

const md = await useMdContent('Home.md')
</script>

<template>
  <h1>Welcome to MKT CMS</h1>

  <AdminWidget>
    <NuxtLink to="/admin/edit/Home.md" target="_blank">
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
