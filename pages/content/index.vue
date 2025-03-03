<script setup lang="ts">
import type { Category, ContentWithCategories } from '~/types';

const { public: { domain } } = useRuntimeConfig();
const { categories, refreshCategories } = await useCategories();

const selectedCategories = ref<number[]>(categories.value?.map((category: Category) => category.id) || []);
const showNewCategoryModal = ref(false);
const newCategoryLabel = ref('');
const posts = ref<ContentWithCategories[]>([]);
const showDeleteModal = ref(false);
const postId = ref(0);
const postToDelete = computed(() => posts.value?.find((post: any) => post.id === postId.value));
const undeletableContent = ref<number[]>([1, 2]);

const createCategory = async () => {
  if (!newCategoryLabel.value) return;
  
  const newCategoryName = newCategoryLabel.value.toLowerCase().replace(/ /g, '-');

  await $fetch('/api/categories/create', { method: 'POST', body: { name: newCategoryName, label: newCategoryLabel.value } });
  showNewCategoryModal.value = false;
  await refreshCategories();
};

const fetchPosts = async () => {
  const data = await $fetch('/api/content/list', { method: 'POST', body: {
    categories: selectedCategories.value.length ? selectedCategories.value : [],
  }});
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
  
  await $fetch('/api/content/delete', { method: 'POST', body: { id: postToDelete.value.id } });
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
      <div class="ml-auto flex items-center space-x-2">
        <NuxtLink to="/content/new" class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
          Neuer Inhalt
        </NuxtLink>
        <button @click="showNewCategoryModal = true" class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
          </svg>
          Neue Kategorie
        </button>
        <NuxtLink to="/content/files" class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          Dateien und Bilder
        </NuxtLink>
      </div>
    </div>

    <div class="mt-4 space-y-2">
      <div v-for="category in categories" :key="category.id" class="flex items-center justify-between space-x-4 text-xl max-w-sm">
        <div>
          <input type="checkbox" :id="category.name" :value="category.id" v-model="selectedCategories" @change="fetchPosts">
          <label :for="category.name" class="ml-2">{{ category.label }}</label>
        </div>
        <NuxtLink :to="`/new?category=${category.id}`" class="text-sm flex items-center space-x-1 rounded px-2 py-1 bg-green-100 text-green-600 hover:bg-green-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>
            Neu
          </span>
        </NuxtLink>
      </div>
    </div>

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
            <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              <div class="text-sm text-gray-900">
                {{ post.categories.map((category: Category) => category.label).join(', ') }}
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
              <div class="text-sm text-gray-900 line-clamp-1">{{ post.description }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ post.url }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=https://${domain}/content/${post.id}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Auf Facebook teilen
              </a>
              <a :href="`/content/${post.id}`" class="text-indigo-600 hover:text-indigo-900 ml-4">Bearbeiten</a>
              <a
                v-if="!undeletableContent.includes(post.id)"
                @click="confirmDeletePost(post.id)"
                class="text-red-600 hover:text-red-900 ml-4 cursor-pointer"
              >
                Löschen
              </a>
              <span v-else class="text-gray-400 ml-4">Nicht löschbar</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="showDeleteModal && postToDelete">
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
          <img v-if="postToDelete.image" :src="`/files/${postToDelete.image}`" alt="event" class="w-full h-56 object-cover object-center rounded">
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
    </Modal>

    <Modal v-if="showNewCategoryModal" @close="showNewCategoryModal = false">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Neue Kategorie
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Geben Sie den Namen der neuen Kategorie ein.
            </p>
          </div>
          <input v-model="newCategoryLabel" type="text" class="input" placeholder="Name" />
          <div class="mt-4 flex justify-center space-x-6">
            <button @click="createCategory" type="button" class="button">
              Speichern
            </button>
            <button @click="showNewCategoryModal = false" type="button" class="button">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>