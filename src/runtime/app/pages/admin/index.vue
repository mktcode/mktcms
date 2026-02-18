<script setup lang="ts">
import Admin from '../../components/admin.vue'
import Header from '../../components/header.vue'
import Content from '../../components/content/index.vue'
import Usage from '../../components/content/usage.vue'
</script>

<template>
  <Admin>
    <Header class="mb-4" />
    <Content />
  </Admin>
  <div class="mt-6 max-w-3xl mx-auto">
    <Usage />
  </div>
</template>
