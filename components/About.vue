<script setup lang="ts">
const about = await useContentById(2);
const products = await useContent([2], 6);

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
          <p class="my-4 text-lg text-center text-gray-600 leading-relaxed line-clamp-6">
            {{ product.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>