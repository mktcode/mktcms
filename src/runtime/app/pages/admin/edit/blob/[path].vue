<script setup lang="ts">
import Admin from '../../../../components/admin.vue'
import Header from '../../../../components/header.vue'
import Editor from '../../../../components/content/editor/blob/index.vue'
import Breadcrumb from '../../../../components/content/breadcrumb.vue'
</script>

<template>
  <Admin>
    <Header />
    <Breadcrumb />
    <Editor />
  </Admin>
</template>
