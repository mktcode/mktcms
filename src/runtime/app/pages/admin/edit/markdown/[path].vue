<script setup lang="ts">
import Admin from '../../../../components/admin.vue'
import AdminWorkspace from '../../../../components/adminWorkspace.vue'
import Markdown from '../../../../components/content/editor/markdown.vue'
import usePathParam from '../../../../composables/usePathParam'

const { isMarkdown } = usePathParam()
</script>

<template>
  <Admin>
    <AdminWorkspace>
      <div class="workspace-panel--fluid flex flex-1 flex-col min-h-0 p-4 md:px-6 pb-3">
        <Markdown v-if="isMarkdown" />
        <div v-else>
          Unbekannter Dateityp.
        </div>
      </div>
    </AdminWorkspace>
  </Admin>
</template>
