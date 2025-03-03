<script setup lang="ts">
definePageMeta({
  middleware() {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  },
})

const route = useRoute();
const categoryId = Array.isArray(route.query.category) ? route.query.category[0] : route.query.category;
const defaultCategories = categoryId ? [parseInt(categoryId)] : [];

const { categories } = await useCategories();

const categoryIds = ref<number[]>(defaultCategories);
const title = ref('');
const description = ref('');
const date = ref<string | null>(null);
const url = ref('');
const image = ref<string | null>(null);

const showFileExplorer = ref(false);

const createPost = async () => {
  await $fetch('/api/content/create', {
    method: 'POST',
    body: {
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
        Inhaltsverwaltung - Neuer Inhalt
      </h1>
      <NuxtLink to="/" class="button ml-auto">Zurück</NuxtLink>
    </div>

    <div class="mt-10">
      <form @submit.prevent="createPost" class="space-y-8">
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Bild</label>
          <div class="mt-1 flex flex-col items-start">
            <img v-if="image" :src="`/files/${image}`" alt="Kein Bild" class="w-96 aspect-video object-cover object-center rounded-lg mb-2" />
            <div>
              <button @click="showFileExplorer = true" type="button" class="button">Bild wählen</button>
              <button v-if="image" @click="image = null" type="button" class="button ml-4">Bild entfernen</button>
            </div>
          </div>
        </div>

        <div>
          <label for="categories" class="block text-sm font-medium text-gray-700">Kategorien</label>
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
          <div class="bg-gray-100 p-2 rounded-t-lg mt-1 text-lg flex space-x-1">
            <button class="size-10 rounded-lg bg-gray-200 aspect-square flex items-center justify-center hover:bg-gray-300 cursor-pointer" @click="description += ' **Fett** '">
              <strong>B</strong>
            </button>
            <button class="size-10 rounded-lg bg-gray-200 aspect-square flex items-center justify-center hover:bg-gray-300 cursor-pointer" @click="description += ' **Fett** '">
              <span class="italic">I</span>
            </button>
            <button class="size-10 rounded-lg bg-gray-200 aspect-square flex items-center justify-center hover:bg-gray-300 cursor-pointer" @click="description += ' **Fett** '">
              <u>U</u>
            </button>
          </div>
          <textarea v-model="description" name="description" id="description" rows="10" class="!rounded-t-none"></textarea>
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Datum</label>
          <input v-model="date" type="date" name="date" id="date">
        </div>

        <div>
          <label for="url" class="block text-sm font-medium text-gray-700">URL</label>
          <input v-model="url" type="text" name="url" id="url">
        </div>

        <div>
          <label for="url" class="block text-sm font-medium text-gray-700">Buchungen</label>
          <button class="button">
            Verfügbarkeit einstellen
          </button>
        </div>

        <button type="submit" class="button">Speichern</button>
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