<script setup lang="ts">
import { type Content } from '~/types';

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

const route = useRoute();
const { data: content } = await useFetch<Content>(`/api/content/${route.params.id}`);

if (!content.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
  })
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <PostHero v-if="content" :title="content.title" :description="content.description" button="Mehr erfahren" />
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
