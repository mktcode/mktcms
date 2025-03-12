<script setup lang="ts">
import type { Content, User } from '~/types';

const contents = ref<Content[]>([]);

const fetchPosts = async () => {
  const data = await $fetch('/api/content/list');
  contents.value = data;
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
      <table class="w-full">
        <thead>
          <tr>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titel
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Untertitel
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beschreibung
            </th>
            <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
          </tr>
        </thead>
        <tbody>
          <ContentListItem v-for="content in contents" :key="content.id" :content="content" />
        </tbody>
      </table>
    </div>
  </div>
</template>