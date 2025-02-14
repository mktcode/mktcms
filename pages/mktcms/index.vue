<script setup lang="ts">
import type { Content } from '~/types';

definePageMeta({
  layout: 'mktcms',
})

const { public: { domain } } = useRuntimeConfig();

const posts = ref<Content[]>([]);
const category = ref('all');
const showDeleteModal = ref(false);
const postId = ref(0);
const postToDelete = computed(() => posts.value?.find((post: any) => post.id === postId.value));

const fetchPosts = async () => {
  const data = await $fetch('/api/posts/list', { method: 'POST', body: { category: category.value } });
  posts.value = data;
};

const confirmDeletePost = (id: number) => {
  showDeleteModal.value = true;
  postId.value = id;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deletePost = async () => {
  if (!postToDelete.value) return;
  
  await $fetch('/api/posts/delete', { method: 'POST', body: { id: postToDelete.value.id } });
  showDeleteModal.value = false;
  await fetchPosts();
};

onMounted(fetchPosts);
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhaltsverwaltung - Übersicht
      </h1>
      <NuxtLink to="/mktcms/new" class="button ml-4">Neuer Inhalt</NuxtLink>
    </div>

    <select v-model="category" @change="() => fetchPosts()" class="mt-4">
      <option value="all">Alle Kategorien</option>
      <option value="event">Veranstaltungen</option>
      <option value="product">Produkte</option>
    </select>

    <div class="mt-10">
      <table class="divide-y divide-gray-200 w-full">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bild
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategorie
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
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
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
              <div class="text-sm text-gray-900">{{ post.category }}</div>
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
              <div class="text-sm text-gray-900 line-clamp-1">{{ post.description }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ post.url }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=https://${domain}/${post.category}/${post.id}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Auf Facebook teilen
              </a>
              <a :href="`/mktcms/${post.id}`" class="text-indigo-600 hover:text-indigo-900 ml-4">Bearbeiten</a>
              <a @click="confirmDeletePost(post.id)" class="text-red-600 hover:text-red-900 ml-4 cursor-pointer">Löschen</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <MktcmsModal v-if="showDeleteModal && postToDelete">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.5-1.607 1.732-2.91l-6.928-12.09c-.768-1.303-2.695-1.303-3.463 0l-6.928 12.09c-.768 1.303.192 2.91 1.732 2.91z" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Post löschen
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Möchten Sie diesen Post wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>
          <h4 class="text-2xl mt-2">
            {{ postToDelete.title }}
          </h4>
          <img :src="`/files/${postToDelete.image}`" alt="event" class="w-full h-56 object-cover object-center rounded">
          <p class="text-gray-400">
            {{ postToDelete.date ? new Date(postToDelete.date).toLocaleDateString('de-DE') : 'Kein Datum' }}
          </p>
          <div class="mt-4 flex justify-center space-x-6">
            <button @click="deletePost" type="button" class="button">
              Löschen
            </button>
            <button @click="closeDeleteModal" type="button" class="button">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </MktcmsModal>
  </div>
</template>