<script setup lang="ts">
import type { Content, Project } from '~/types';

const props = defineProps<{
  project: Project;
  content: Content;
}>();

const children = ref<Content[]>([]);

const fetchChildren = async () => {
  const data = await $fetch('/api/content/list', {
    query: {
      projectId: props.project.id,
      parentId: props.content.id,
    }
  });
  children.value = data;
};

onMounted(fetchChildren);
</script>

<template>
  <tr :class="{ 'bg-gray-50': content.parentId }">
    <td class="px-3 py-2 whitespace-nowrap">
      <img v-if="content.image" :src="`/files/${content.image}`" alt="Kein Bild" class="w-24 aspect-video object-cover object-center rounded">
      <div v-else class="w-24 aspect-video text-gray-400 bg-gray-100 items-center justify-center flex rounded">
        Kein Bild
      </div>
    </td>
    <td class="px-3 py-2 whitespace-nowrap">
      <div class="text-sm text-gray-900">{{ content.title }}</div>
    </td>
    <td class="px-3 py-2 whitespace-nowrap">
      <div class="text-sm text-gray-900">
        {{ content.date ? new Date(content.date).toLocaleDateString('de-DE') : 'Kein Datum' }}
      </div>
    </td>
    <td class="px-3 py-2">
      <div class="text-sm text-gray-900 prose prose-sm line-clamp-1" v-html="content.description" />
    </td>
    <td class="px-3 py-2 whitespace-nowrap">
      <div class="text-sm text-gray-900">{{ content.url }}</div>
    </td>
    <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
      <a :href="`/content/${content.id}`" class="text-indigo-600 hover:text-indigo-900 ml-4">Bearbeiten</a>
    </td>
  </tr>
  <ListItem v-for="child in children" :key="child.id" :project="project" :content="child" />
</template>