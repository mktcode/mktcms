<script setup lang="ts">
import type { Content, Project } from '~/types';
import ListItem from './ListItem.vue';

const props = defineProps<{
  project: Project;
}>();

const contents = ref<Content[]>([]);

const fetchPosts = async () => {
  const data = await $fetch('/api/content/list', {
    query: {
      projectId: props.project.id,
    }
  });
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
        <tbody>
          <ListItem v-for="content in contents" :key="content.id" :project="project" :content="content" />
        </tbody>
      </table>
    </div>
  </div>
</template>