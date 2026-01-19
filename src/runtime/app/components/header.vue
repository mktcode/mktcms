<script setup lang="ts">
import { useRoute, useRuntimeConfig } from '#imports'

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()

const route = useRoute()
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <NuxtLink
      v-if="route.fullPath != '/admin'"
      to="/admin"
      class="button soft"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="button-icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </NuxtLink>
    <NuxtLink
      to="/admin/new"
      class="button ml-auto"
    >
      Datei hochladen
    </NuxtLink>
    <NuxtLink
      :to="siteUrl"
      external
      target="_blank"
      class="button soft"
    >
      zur Website
    </NuxtLink>
    <NuxtLink
      external
      to="/api/admin/logout"
      class="button soft"
    >
      Abmelden
    </NuxtLink>
  </div>
</template>
