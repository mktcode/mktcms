<script setup lang="ts">
import Admin from '../../components/admin.vue'
import Header from '../../components/header.vue'
import Content from '../../components/content/index.vue'
import Versioning from '../../components/content/versioning.vue'
import Usage from '../../components/content/usage.vue'
import { useRuntimeConfig } from '#imports'

const { public: { mktcms: { showVersioning } } } = useRuntimeConfig()
</script>

<template>
  <Admin>
    <div class="boxed">
      <Header class="mb-4" />
      <Content />
    </div>
    <div class="mt-6 max-w-3xl mx-auto p-4 border border-gray-200 rounded-2xl">
      <Versioning v-if="showVersioning" class="mb-4" />
      <Usage />
    </div>
  </Admin>
</template>
