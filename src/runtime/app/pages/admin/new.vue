<script setup lang="ts">
import Admin from '../../components/admin.vue'
import AdminWorkspace from '../../components/adminWorkspace.vue'
import ContentUpload from '../../components/content/upload.vue'
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <div class="flex flex-1 flex-col min-h-0 p-4 md:px-6 overflow-y-auto">
        <ContentUpload />
      </div>
    </AdminWorkspace>
  </Admin>
</template>
