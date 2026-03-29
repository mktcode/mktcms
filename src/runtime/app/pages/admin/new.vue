<script setup lang="ts">
import Admin from '../../components/admin.vue'
import AdminWorkspace from '../../components/adminWorkspace.vue'
import ContentUpload from '../../components/content/upload.vue'
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <div class="workspace-panel workspace-panel--scroll">
        <ContentUpload />
      </div>
    </AdminWorkspace>
  </Admin>
</template>
