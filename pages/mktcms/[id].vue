<script setup lang="ts">
import type { Post } from '~/types';

definePageMeta({
  layout: 'mktcms',
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

const route = useRoute();
const { data: post } = await useFetch<Post>(`/api/posts/${route.params.id}`);
const { data: files } = await useFetch('/api/files/list', {
  method: 'POST',
  body: { extensions: ['webp'] },
})

const category = ref(post.value?.category);
const title = ref(post.value?.title);
const description = ref(post.value?.description);
const date = ref(post.value?.date);
const url = ref(post.value?.url);
const image = ref(post.value?.image);

const showImageModal = ref(false);

const createPost = async () => {
  await $fetch('/api/posts/update', {
    method: 'POST',
    body: {
      id: route.params.id,
      category: category.value,
      title: title.value,
      description: description.value,
      date: date.value,
      url: url.value,
      image: image.value,
    },
  });
  navigateTo('/mktcms');
};
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhaltsverwaltung - Bearbeiten
      </h1>
      <NuxtLink to="/mktcms" class="button ml-auto">Zurück</NuxtLink>
    </div>

    <div class="mt-10">
      <form @submit.prevent="createPost" class="space-y-8">
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Bild</label>
          <div class="mt-1 flex items-center">
            <img v-if="image" :src="`/files/${image}`" alt="Kein Bild" class="w-20 h-20 object-cover object-center rounded-lg" />
            <button @click="showImageModal = true" type="button" class="button ml-4">Bild wählen</button>
            <button v-if="image" @click="image = undefined" type="button" class="button ml-4">Bild entfernen</button>
          </div>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Kategorie</label>
          <select v-model="category" name="category" id="category">
            <option value="event">Veranstaltung</option>
            <option value="product">Produkt</option>
          </select>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
          <input v-model="title" type="text" name="title" id="title">
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea v-model="description" name="description" id="description" rows="3" />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Datum</label>
          <input v-model="date" type="date" name="date" id="date">
        </div>

        <div>
          <label for="url" class="block text-sm font-medium text-gray-700">URL</label>
          <input v-model="url" type="text" name="url" id="url">
        </div>

        <button type="submit" class="button">Aktualisieren</button>
      </form>
    </div>

    <MktcmsModal v-if="showImageModal">
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Bild wählen
          </h3>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div v-for="file in files" :key="file">
              <img :src="`/files/${file}`" alt="Kein Bild" class="w-20 h-20 object-cover object-center rounded-lg" />
              <button @click="image = file; showImageModal = false" type="button" class="button mt-2">Auswählen</button>
            </div>
          </div>
        </div>
      </div>
    </MktcmsModal>
  </div>
</template>