<script setup lang="ts">
navigateTo('/buchhaltung/kunden')
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting />
    </template>
    <h1>Buchhaltung</h1>
  </NuxtLayout>
</template>