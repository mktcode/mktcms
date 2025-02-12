<script setup lang="ts">
import type { Post } from '~/types';

definePageMeta({
  layout: 'mktcms',
})

const posts = ref<Post[]>([]);
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
      <NuxtLink to="/" target="_blank" class="button ml-auto">Website öffnen</NuxtLink>
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategorie
            </th>
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
              <div class="text-sm text-gray-900">{{ post.category }}</div>
            </td>
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
              <a @click="confirmDeletePost(post.id)" class="text-red-600 hover:text-red-900 ml-4 cursor-pointer">Löschen</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDeleteModal && postToDelete" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500/50" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
                <img :src="postToDelete.image" alt="event" class="w-full h-56 object-cover object-center rounded">
                <p class="text-gray-400">
                  {{ new Date(postToDelete.date).toLocaleDateString('de-DE') }} - {{ new Date(postToDelete.date).toTimeString().slice(0, 5) }} Uhr
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>