<script setup lang="ts">
import Admin from '../../../components/admin.vue'
import AdminWorkspace from '../../../components/adminWorkspace.vue'
import Delete from '../../../components/content/delete.vue'
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <div class="flex flex-1 flex-col min-h-0 p-4 md:px-6 overflow-y-auto max-w-[64rem]">
        <Delete />
      </div>
    </AdminWorkspace>
  </Admin>
</template>
