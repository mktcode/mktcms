<script setup lang="ts">
import type { Post } from '~/types';

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

const route = useRoute();
const { data: post } = await useFetch<Post>(`/api/posts/${route.params.id}`);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
  })
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <PostHero v-if="post" :title="post.title" :description="post.description" button="Mehr erfahren" />
  </div>
  <section class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <p class="mt-8 text-xl text-gray-600 leading-relaxed">
        {{ post?.description }}
      </p>
    </div>
  </section>
  <Contact />
  <Footer />
</template>
