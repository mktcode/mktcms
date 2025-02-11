<script setup lang="ts">
const title = ref('');
const description = ref('');
const date = ref('');
const url = ref('');

const createPost = async () => {
  await $fetch('/api/posts/create', {
    method: 'POST',
    body: {
      title: title.value,
      description: description.value,
      date: date.value,
      url: url.value,
    },
  });
  navigateTo('/mktcms');
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhaltsverwaltung - Neuer Inhalt
      </h1>
    </div>

    <div class="mt-10">
      <form @submit.prevent="createPost" class="space-y-8">
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

        <button type="submit" class="button">Speichern</button>
      </form>
    </div>
  </div>
</template>