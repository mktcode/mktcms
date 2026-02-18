<script setup lang="ts">
import { useRuntimeConfig, useRoute } from '#imports'
import Breadcrumb from './content/breadcrumb.vue'

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()
</script>

<template>
  <div class="flex items-start justify-between gap-2">
    <Breadcrumb />
    <NuxtLink
      :to="siteUrl"
      class="button small secondary justify-between ml-auto"
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
