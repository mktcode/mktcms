<script setup lang="ts">
const route = useRoute();
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const category = Array.isArray(route.params.category) ? route.params.category[0] : route.params.category;
const content = await useContentById(id);

if (!content || content.categories.some((c) => c.name !== category)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
  })
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <PageHero v-if="content" :title="content.title" :description="content.description" button="Jetzt Termin vereinbaren" />
  </div>
  <section class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <p class="mt-8 text-xl text-gray-600 leading-relaxed">
        {{ content?.description }}
      </p>
    </div>
  </section>
  <Contact />
  <Footer />
</template>
