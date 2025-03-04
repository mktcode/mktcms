<script setup lang="ts">
import type { Content, Project } from '~/types';

const props = defineProps<{
  project: Project;
}>();

const posts = ref<Content[]>([]);

const fetchPosts = async () => {
  const data = await $fetch('/api/content/list', { method: 'POST', body: {
    projectId: props.project.id,
  }});
  posts.value = data;
};

onMounted(fetchPosts);
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhaltsverwaltung - Übersicht
      </h1>
    </div>

    <div class="mt-10">
      <table class="divide-y divide-gray-200 w-full">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bild
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titel
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beschreibung
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in posts" :key="post.id">
            <td class="px-3 py-2 whitespace-nowrap">
              <img v-if="post.image" :src="`/files/${post.image}`" alt="Kein Bild" class="w-24 aspect-video object-cover object-center rounded">
              <div v-else class="w-24 aspect-video text-gray-400 bg-gray-100 items-center justify-center flex rounded">
                Kein Bild
              </div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ post.title }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ post.date ? new Date(post.date).toLocaleDateString('de-DE') : 'Kein Datum' }}
              </div>
            </td>
            <td class="px-3 py-2">
              <div class="text-sm text-gray-900 prose prose-sm" v-html="post.description" />
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ post.url }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
              <a :href="`/content/${post.id}`" class="text-indigo-600 hover:text-indigo-900 ml-4">Bearbeiten</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>