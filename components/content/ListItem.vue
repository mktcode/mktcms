<script setup lang="ts">
import type { Content } from '~/types';

const props = defineProps<{
  content: Content;
}>();

const children = ref<Content[]>([]);

const fetchChildren = async () => {
  const data = await $fetch('/api/content/list', {
    query: {
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
    <td class="px-3">
      <div class="text-gray-900 prose prose-sm line-clamp-1" v-html="content.subtitle" />
    </td>
    <td class="px-3">
      <div class="text-gray-900 prose prose-sm line-clamp-1" v-html="content.description" />
    </td>
    <td class="whitespace-nowrap py-px">
      <UButton :href="`/werbung/${content.id}`" class="w-fit ml-auto" icon="i-heroicons-pencil">
        Bearbeiten
      </UButton>
    </td>
  </tr>
  <ContentListItem v-for="child in children" :key="child.id" :content="child" />
</template>