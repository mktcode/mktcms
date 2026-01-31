<script setup lang="ts">
import { useRoute, useRuntimeConfig } from '#imports'

const route = useRoute()

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()
</script>

<template>
  <div class="flex items-start justify-between gap-2">
    <NuxtLink
      to="/admin"
      class="text-xl text-gray-950! bg-white! mr-auto flex items-center gap-3"
    >
      <svg v-if="route.path.replace(/^\//, '') !== 'admin'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
      {{ siteUrl.replace(/https?:\/\//, '') }}
    </NuxtLink>
    <NuxtLink
      :to="siteUrl"
      class="button small secondary justify-between"
      external
      target="_blank"
    >
      zur Website
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </NuxtLink>
    <NuxtLink
      external
      to="/api/admin/logout"
      class="button small secondary"
    >
      <span class="hidden sm:inline">
        abmelden
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      </svg>
    </NuxtLink>
  </div>
</template>
