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
  <tr :class="{ 'text-sm': content.parentId }">
    <td class="border-l border-gray-200 pr-3 whitespace-nowrap">
      <div class="text-gray-900 flex items-center gap-2">
        <div v-if="content.parentId" class="w-6 h-px bg-gray-300" />
        <div v-else class="w-2 h-px" />
        {{ content.title }}
      </div>
    </td>
    <td>
      <img v-if="content.image" :src="`/files/${content.image}`" alt="Kein Bild" class="w-24 aspect-video object-cover object-center">
      <div v-else class="w-24 aspect-video text-gray-400 bg-gray-100 items-center justify-center flex">
        Kein Bild
      </div>
    </td>
    <td class="px-3">
      <div class="text-gray-900 prose prose-sm line-clamp-1" v-html="content.description" />
    </td>
    <td class="whitespace-nowrap">
      <a :href="`/content/${content.id}`" class="button w-fit ml-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
        Bearbeiten
      </a>
    </td>
  </tr>
  <ListItem v-for="child in children" :key="child.id" :project="project" :content="child" />
</template>