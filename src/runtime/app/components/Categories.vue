<script setup lang="ts">
const { data: categories } = await useFetch('/api/admin/categories/list')
</script>

<template>
  <div class="container mx-auto py-12">
    <h1 class="text-3xl font-bold mb-6">
      Inhalte - Kategorien
    </h1>
    <div v-if="categories && categories.length">
      <div
        v-for="category in categories"
        :key="category.id"
        class="text-6xl"
      >
        <Icon name="heroicons:folder-open" />
        <h2 class="text-xl font-bold mb-2">
          {{ category.name }}
        </h2>
      </div>
    </div>
  </div>
</template>
