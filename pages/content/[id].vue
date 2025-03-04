<script setup lang="ts">
import type { ContentWithCategories } from '~/types';

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

const route = useRoute();
const { data: content } = await useFetch<ContentWithCategories>(`/api/content/${route.params.id}`);

const { categories } = await useCategories();

const categoryIds = ref<number[]>(content.value?.categories.map((category) => category.id) ?? []);
const title = ref(content.value?.title);
const description = ref(content.value?.description);
const date = ref(content.value?.date ?? null);
const url = ref(content.value?.url);
const image = ref(content.value?.image ?? null);

const showFileExplorer = ref(false);

const createPost = async () => {
  await $fetch('/api/content/update', {
    method: 'POST',
    body: {
      id: route.params.id,
      categories: categoryIds.value,
      title: title.value,
      description: description.value,
      date: date.value,
      url: url.value,
      image: image.value,
    },
  });
  navigateTo('/');
};
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhaltsverwaltung - Bearbeiten
      </h1>
      <NuxtLink to="/" class="button ml-auto">Zurück</NuxtLink>
    </div>

    <div class="mt-10">
      <form @submit.prevent="createPost" class="gap-8">
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Bild</label>
          <div class="mt-1 flex items-center">
            <img v-if="image" :src="`/files/${image}`" alt="Kein Bild" class="w-20 h-20 object-cover object-center rounded-lg" />
            <button @click="showFileExplorer = true" type="button" class="button ml-4">Bild wählen</button>
            <button v-if="image" @click="image = null" type="button" class="button ml-4">Bild entfernen</button>
          </div>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Kategorie</label>
          <div class="mt-1">
            <div v-for="category in categories" :key="category.id">
              <input type="checkbox" :id="category.name" :value="category.id" v-model="categoryIds">
              <label :for="category.name" class="ml-2">{{ category.label }}</label>
            </div>
          </div>
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
        &#8203;
      </form>
    </div>

    <FileExplorer
      :show="showFileExplorer"
      :extensions="['webp']"
      @select="image = $event"
      @close="showFileExplorer = false"
    />
  </div>
</template>