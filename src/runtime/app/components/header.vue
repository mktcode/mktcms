<script setup lang="ts">
import { useRuntimeConfig } from '#imports';

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()
</script>

<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <h1 style="margin-bottom: 0;">
        <NuxtLink
          to="/admin"
          style="text-decoration: none; color: inherit;"
        >
          Website Verwaltung
        </NuxtLink>
      </h1>
      <a :href="siteUrl" target="_blank" style="font-size: 0.9em; color: #666;">
        Website ansehen
      </a>
    </div>
    <NuxtLink
      external
      to="/api/admin/logout"
      style="background-color: #ccc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
    >
      Abmelden
    </NuxtLink>
  </div>
</template>
