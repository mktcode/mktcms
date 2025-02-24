<script setup lang="ts">
const props = defineProps<{
  categoryId: number;
}>();

const items = await useContent([props.categoryId], 6);
</script>

<template>
  <section class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <div
        v-if="items.length"
        class="mt-24 flex flex-wrap items-start justify-center gap-12"
      >
        <div v-for="product in items" :key="product.id" class="flex flex-col items-center max-w-md">
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