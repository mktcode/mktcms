<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts', { method: 'POST' });
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <h1 class="text-3xl font-bold text-gray-900">
      Inhaltsverwaltung
    </h1>

    <div class="mt-10">
      <table class="divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bild
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titel
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beschreibung
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in posts" :key="post.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="post.image" alt="Kein Bild" class="w-30 aspect-square object-cover object-center rounded">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ post.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ new Date(post.date).toLocaleDateString('de-DE') }} - {{ new Date(post.date).toTimeString().slice(0, 5) }} Uhr</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 line-clamp-1">{{ post.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ post.url }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <a :href="`/mktcms/${post.id}`" class="text-indigo-600 hover:text-indigo-900">Bearbeiten</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>