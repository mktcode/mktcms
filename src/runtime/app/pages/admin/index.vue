<script setup lang="ts">
import Admin from '../../components/admin.vue'
import Header from '../../components/header.vue'
import Content from '../../components/content/index.vue'
import Usage from '../../components/content/usage.vue'
</script>

<template>
  <Admin class="bg-transparent! shadow-none! p-0! mb-12">
    <Header />
  </Admin>
  <Admin>
    <Content />
  </Admin>
  <div class="mt-6 max-w-3xl mx-auto">
    <Usage />
  </div>
</template>
