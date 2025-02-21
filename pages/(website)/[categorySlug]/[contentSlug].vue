<script setup lang="ts">
const route = useRoute();
const contentSlug = Array.isArray(route.params.contentSlug) ? route.params.contentSlug[0] : route.params.contentSlug;
const categorySlug = Array.isArray(route.params.categorySlug) ? route.params.categorySlug[0] : route.params.categorySlug;
const content = await useContentById(contentSlug);

if (!content || content.categories.some((c) => c.name !== categorySlug)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
  })
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <WebsiteNavbar />
    <WebsitePageHero v-if="content" :title="content.title" :description="content.description" button="Jetzt Termin vereinbaren" />
  </div>
  <section class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <p class="mt-8 text-xl text-gray-600 leading-relaxed">
        {{ content?.description }}
      </p>
    </div>
  </section>
  <WebsiteSectionContact />
  <WebsiteSectionFooter />
</template>
