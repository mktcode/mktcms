<script setup lang="ts">
import type { Category, ContentWithCategories } from '~/types';

definePageMeta({
  layout: 'mktcms',
})

const { public: { domain } } = useRuntimeConfig();
const { categories, refreshCategories } = await useCategories();

const selectedCategories = ref<number[]>(categories.value?.map((category: Category) => category.id) || []);
const showNewCategoryModal = ref(false);
const newCategoryLabel = ref('');
const posts = ref<ContentWithCategories[]>([]);
const showDeleteModal = ref(false);
const postId = ref(0);
const postToDelete = computed(() => posts.value?.find((post: any) => post.id === postId.value));

const createCategory = async () => {
  if (!newCategoryLabel.value) return;
  
  const newCategoryName = newCategoryLabel.value.toLowerCase().replace(/ /g, '-');

  await $fetch('/api/categories/create', { method: 'POST', body: { name: newCategoryName, label: newCategoryLabel.value } });
  showNewCategoryModal.value = false;
  await refreshCategories();
};

const fetchPosts = async () => {
  const data = await $fetch('/api/posts/list', { method: 'POST', body: {
    categories: selectedCategories.value.length ? selectedCategories.value : [],
  }});
  posts.value = data;
};

const confirmDeletePost = (id: number) => {
  showDeleteModal.value = true;
  postId.value = id;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deletePost = async () => {
  if (!postToDelete.value) return;
  
  await $fetch('/api/posts/delete', { method: 'POST', body: { id: postToDelete.value.id } });
  showDeleteModal.value = false;
  await fetchPosts();
};

onMounted(fetchPosts);
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Kalender
      </h1>
      <NuxtLink to="#" class="button ml-4 opacity-25">Neue Buchung</NuxtLink>
    </div>

    <div class="mt-10">
      Der Kalender ist nicht freigegeben.
    </div>
  </div>
</template>