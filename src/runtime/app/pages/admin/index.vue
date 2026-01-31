<script setup lang="ts">
import Admin from '../../components/admin.vue'
import Header from '../../components/header.vue'
import Breadcrumb from '../../components/content/breadcrumb.vue'
import Content from '../../components/content/index.vue'
import Usage from '../../components/content/usage.vue';
</script>

<template>
  <Admin>
    <Header />
    <Breadcrumb />
    <Content />
    <Usage />
  </Admin>
</template>
