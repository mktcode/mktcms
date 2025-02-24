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

const { categories } = await useCategories()

const save = async () => {
  await useFetch('/api/theme/save', {
    method: 'POST',
    body: {
      primaryColor: primaryColor.value,
      primaryColorHover: primaryColorHover.value,
    },
  })
}
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

    <h1 class="text-3xl font-bold mb-4 mt-10">
      Startseite
    </h1>
    <MktcmsSections :route="null" :category-id="null" :is-details-page="false" />

    <h1 class="text-3xl font-bold mb-4 mt-10">
      Kategorien
    </h1>
    <div v-for="category in categories" :key="category.id">
      <h2 class="text-2xl font-bold mb-4">
        {{ category.label }} - Listenansicht
      </h2>
      <MktcmsSections :category-id="category.id" />

      <h2 class="text-2xl font-bold mt-6 mb-4">
        {{ category.label }} - Detailansicht
      </h2>
      <MktcmsSections :category-id="category.id" :is-details-page="true" />
    </div>
  </div>
</template>