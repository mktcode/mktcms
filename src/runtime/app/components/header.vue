<script setup lang="ts">
import { useRuntimeConfig } from '#imports';

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()
</script>

<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h1 style="margin: 0;">
      <NuxtLink
        to="/admin"
        style="text-decoration: none; color: inherit;"
      >
        Website Verwaltung
      </NuxtLink>
    </h1>
    <div>
      <NuxtLink
        :to="siteUrl"
        external
        target="_blank"
        style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;"
      >
        Website ansehen
      </NuxtLink>
      <NuxtLink
        external
        to="/api/admin/logout"
        style="background-color: #ccc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
      >
        Abmelden
      </NuxtLink>
    </div>
  </div>
</template>
