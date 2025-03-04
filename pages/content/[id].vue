<script setup lang="ts">
import type { Content, ContentUpdate } from '~/types';

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})

const route = useRoute()
const contentId = Array.isArray(route.params.id) ? Number(route.params.id[0]) : Number(route.params.id)

const { data: content } = await useFetch<Content>(`/api/content/${contentId}`);

const updatePost = async (update: ContentUpdate) => {
  await $fetch('/api/content/update', {
    method: 'POST',
    body: {
      id: contentId,
      title: update.title,
      description: update.description,
      date: update.date,
      url: update.url,
    },
  });
  navigateTo('/content');
};
</script>

<template>
  <div>
    <ContentForm v-if="content" :content="content" @submit="updatePost" />
    <div v-else>Inhalt nicht gefunden</div>
  </div>
</template>