<script setup lang="ts">
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});

definePageMeta({
  layout: 'login',
})
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <img src="~/assets/img/mktcms.png" alt="Error" class="w-32 mx-auto mb-12" />
    <a href="/auth/google" class="border border-gray-300 rounded-md p-4 text-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between space-x-4">
      <img src="~/assets/img/google.svg" class="size-8" />
      Mit Google anmelden
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 opacity-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  </div>
</template>