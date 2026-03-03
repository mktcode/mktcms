<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import Breadcrumb from './content/breadcrumb.vue'
import AgentModal from './agentModal.vue'

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()
const isAgentModalOpen = ref(false)
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
      <img
        src="/favicon.png"
        alt=""
        class="size-4 mr-1 rounded-sm"
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
    <button
      type="button"
      class="button small secondary"
      @click="isAgentModalOpen = true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 3v3" /><path d="M18.36 5.64 16.24 7.76" /><path d="M21 12h-3" /><path d="m18.36 18.36-2.12-2.12" /><path d="M12 21v-3" /><path d="m7.76 16.24-2.12 2.12" /><path d="M6 12H3" /><path d="m7.76 7.76-2.12-2.12" /><circle cx="12" cy="12" r="3" />
      </svg>
      KI-Agent
    </button>
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

    <AgentModal
      :is-open="isAgentModalOpen"
      @close="isAgentModalOpen = false"
    />
  </div>
</template>
