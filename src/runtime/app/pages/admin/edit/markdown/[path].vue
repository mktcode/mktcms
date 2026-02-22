<script setup lang="ts">
import Admin from '../../../../components/admin.vue'
import Header from '../../../../components/header.vue'
import Markdown from '../../../../components/content/editor/markdown.vue'
import usePathParam from '../../../../composables/usePathParam'

const { isMarkdown } = usePathParam()
</script>

<template>
  <Admin>
    <div class="fullscreen">
      <Header />
      <Markdown v-if="isMarkdown" />
      <div v-else>
        Unbekannter Dateityp.
      </div>
    </div>
  </Admin>
</template>
