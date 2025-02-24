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

const theme = await useTheme()
const primaryColor = ref(theme.primaryColor)
const primaryColorHover = ref(theme.primaryColorHover)

const save = async () => {
  await useFetch('/api/theme/save', {
    method: 'POST',
    body: {
      primaryColor: primaryColor.value,
      primaryColorHover: primaryColorHover.value,
    },
  })
}

const pages = await $fetch('/api/pages/list', { method: 'POST' })
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">
      Farben
    </h1>

    <form class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="primaryColor">Primärfarbe</label>
        <input id="primaryColor" type="color" v-model="primaryColor" />
      </div>
      <div>
        <label for="primaryColorHover">Primärfarbe (hover)</label>
        <input id="primaryColorHover" type="color" v-model="primaryColorHover" />
      </div>
    </form>
    <div class="mt-4 flex justify-end">
      <button type="submit" class="button" @click="save">
        Speichern
      </button>
    </div>

    <template v-for="page in pages">
      <h1 class="text-3xl font-bold mb-4 mt-10">
        {{ page.title }}
      </h1>
      <MktcmsSections :pageId="page.id" />
    </template>
  </div>
</template>