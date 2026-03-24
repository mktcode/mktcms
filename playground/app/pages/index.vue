<script setup lang="ts">
useTrackTraffic()

const siteUrl = useSiteUrl()

const md = await useMdContent('Home.md')
const txt = await useTxtContent('Title.txt')

const imagePaths = await useImagePaths()
</script>

<template>
  <div id="mktcms-page">
    <main class="page-shell">
      <section class="hero-card">
        <p class="eyebrow">
          MktCMS Playground
        </p>
        <h1 class="hero-title">
          {{ txt }}
        </h1>
        <p class="hero-copy">
          A small, content-driven playground for exploring MktCMS. Browse uploaded media,
          open the admin area, and preview the Markdown content rendered from storage.
        </p>

        <AdminWidget>
          <NuxtLink
            to="/admin/edit/markdown/Home.md"
            target="_blank"
            class="admin-link"
          >
            Open Admin Panel
          </NuxtLink>
        </AdminWidget>
      </section>

      <section
        v-if="imagePaths?.length"
        class="content-section"
      >
        <div class="section-header">
          <h2>Gallery</h2>
          <p>{{ imagePaths.length }} image{{ imagePaths.length === 1 ? '' : 's' }}</p>
        </div>

        <div class="image-grid">
          <img
            v-for="path in imagePaths"
            :key="path"
            :src="`${siteUrl}/api/content/${path}`"
            :alt="`Image at ${path}`"
            class="preview-image"
          >
        </div>
      </section>

      <section
        v-if="md"
        class="content-section markdown-content"
      >
        <div class="section-header">
          <h2>Markdown Content</h2>
          <p>Loaded from <code>Home.md</code></p>
        </div>

        <img
          :src="`${siteUrl}${md.frontmatter.Bild}`"
          alt="Bild aus Frontmatter"
          class="featured-image"
        >
        <MDC
          :value="md.markdown"
          tag="article"
          class="prose max-w-none"
        />
      </section>
    </main>
  </div>
</template>
