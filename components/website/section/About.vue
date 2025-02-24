<script setup lang="ts">
import type { ContentWithCategories } from '~/types';

const props = defineProps<{
  contentId: number;
}>();

const about = await useContentById(props.contentId);
const products: ContentWithCategories[] = [];

if (!about) {
  throw createError({
    statusCode: 404,
    statusMessage: 'About content not found'
  });
}
</script>

<template>
  <section id="about" class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12">
        <img
          v-if="about.image"
          :src="`/files/${about.image}`"
          alt="kein Bild"
          class="rounded-full w-64 h-64"
        >
        <div class="about-content">
          <h3 class="text-2xl font-bold text-rose-900 mb-4">
            {{ about.subtitle }}
          </h3>
          <h2 class="text-4xl md:text-6xl font-bold text-indigo-950">
            {{ about.title }}
          </h2>
          <div v-html="about.description" />
        </div>
      </div>
      <div
        v-if="products.length"
        class="mt-24 flex flex-wrap items-start justify-center gap-12"
      >
        <div v-for="product in products" :key="product.id" class="flex flex-col items-center max-w-md">
          <h4 class="text-2xl font-bold text-indigo-950">
            {{ product.title }}
          </h4>
          <p class="my-4 text-lg text-center text-gray-600 leading-relaxed line-clamp-5">
            {{ product.description }}
          </p>
          <NuxtLink :to="`/${product.categories[0].name}/${product.slug}`" class="text-rose-900 font-bold px-4 py-2 border border-rose-100 rounded-2xl hover:bg-rose-900 hover:border-rose-900 hover:text-white transition-colors duration-300 ease-in-out">
            Mehr erfahren
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>