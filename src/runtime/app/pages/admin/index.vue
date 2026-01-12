<script setup lang="ts">
import Admin from '../../components/admin.vue'
import Content from '../../components/content/index.vue'
import ContentUpload from '../../components/content/upload.vue'
</script>

<template>
  <Admin>
    <h1>Admin Dashboard</h1>
    <a href="/api/admin/logout">Abmelden</a>

    <ContentUpload />
    <Content />
  </Admin>
</template>