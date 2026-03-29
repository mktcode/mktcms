<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
import Header from './header.vue'
import Content from './content/index.vue'
import Versioning from './content/versioning.vue'
import Stats from './content/stats.vue'
import Usage from './content/usage.vue'

const props = withDefaults(defineProps<{
  sectionLabel?: string
}>(), {
  sectionLabel: 'Dateien',
})

const { public: { mktcms: { showVersioning } } } = useRuntimeConfig()
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-brand">
        MKTCMS
      </div>

      <div class="admin-sidebar-files">
        <div class="admin-sidebar-section-label flex items-center">
          {{ props.sectionLabel }}
          <Versioning v-if="showVersioning" />
        </div>
        <Content />
      </div>

      <div class="admin-sidebar-footer">
        <Usage />
        <Stats />
      </div>
    </aside>

    <div class="admin-main">
      <div class="admin-topbar">
        <Header />
      </div>

      <div class="admin-view-slot">
        <slot />
      </div>
    </div>
  </div>
</template>