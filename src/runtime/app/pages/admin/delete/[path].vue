<script setup lang="ts">
import Admin from '../../../components/admin.vue'
import AdminWorkspace from '../../../components/adminWorkspace.vue'
import Delete from '../../../components/content/delete.vue'
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <div class="workspace-panel workspace-panel--scroll workspace-panel--compact">
        <Delete />
      </div>
    </AdminWorkspace>
  </Admin>
</template>
