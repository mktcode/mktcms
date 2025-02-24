<script setup lang="ts">
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

const pages = await $fetch('/api/pages/list', { method: 'POST' })
</script>

<template>
  <div>
    <MktcmsLayoutTheme />

    <template v-for="page in pages">
      <h1 class="text-3xl font-bold mb-4 mt-10">
        {{ page.title }}
      </h1>
      <MktcmsSections :pageId="page.id" />
    </template>
  </div>
</template>