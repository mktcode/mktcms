<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts/list', { method: 'POST', body: { category: 'event', limit: 8 } });
</script>

<template>
  <div class="bg-white py-24">
    <div class="container mx-auto">
      <h3 class="text-2xl text-center font-bold text-rose-900 mb-4">
        Buche jetzt dein persönliches Coaching.
      </h3>
      <h2 class="text-4xl md:text-6xl text-center font-bold text-indigo-950">
        Einzelcoachings
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        <div v-for="post in posts" :key="post.id" class="overflow-hidden">
          <img :src="`/files/${post.image}`" alt="event" class="rounded-2xl saturate-[75%] w-full h-56 object-cover object-center">
          <div class="pt-4 flex flex-col">
            <h2 class="text-xl font-bold text-gray-800 line-clamp-1">{{ post.title }}</h2>
            <p class="text-gray-600 mt-2 line-clamp-2">{{ post.description }}</p>
            <div class="flex justify-end items-center mt-4 space-x-6">
              <div class="text-4xl font-bold">35,00 €</div>
              <a
                :href="`/${post.category}/${post.id}`"
                class="button"
              >
                Termin vereinbaren
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>