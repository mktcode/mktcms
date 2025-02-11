<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts/list', { method: 'POST', body: { category: 'event', limit: 6 } });
</script>

<template>
  <div class="bg-gray-100 py-24">
    <div class="container mx-auto">
      <h3 class="text-2xl font-bold text-rose-900 mb-4">
        Es gibt noch freie Plätze.
      </h3>
      <h2 class="text-4xl md:text-6xl font-bold text-indigo-950">
        Kommende Veranstaltungen
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        <div v-for="post in posts" :key="post.id" class="bg-white shadow-2xl rounded-lg overflow-hidden">
          <img :src="post.image" alt="event" class="w-full h-56 object-cover object-center">
          <div class="p-4">
            <h2 class="text-xl font-bold text-gray-800 line-clamp-1">{{ post.title }}</h2>
            <p class="text-gray-400">
              {{ new Date(post.date).toLocaleDateString('de-DE') }} - {{ new Date(post.date).toTimeString().slice(0, 5) }} Uhr
            </p>
            <p class="text-gray-600 mt-2 line-clamp-2">{{ post.description }}</p>
            <a :href="post.url" class="button w-full mt-4">zur Anmeldung</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>