<script setup lang="ts">
import Admin from '../../components/admin.vue'
import Content from '../../components/content/index.vue'
import ContentUpload from '../../components/content/upload.vue'
</script>

<template>
  <Admin>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1>Website Verwaltung</h1>
      <a href="/api/admin/logout" style="background-color: #ccc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Abmelden
      </a>
    </div>

    <ContentUpload />
    <Content />
  </Admin>
</template>