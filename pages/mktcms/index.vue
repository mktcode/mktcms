<script setup lang="ts">
import type { Category, ContentWithCategories } from '~/types';

useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});

definePageMeta({
  layout: 'mktcms',
  middleware() {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
      return navigateTo('/mktcms/login')
    }
  },
})
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Willkommen
      </h1>
    </div>
  </div>
</template>