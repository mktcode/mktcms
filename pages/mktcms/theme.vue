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

const { data: sections, refresh } = await useFetch('/api/sections/list', { method: 'POST' });

const save = async () => {
  await useFetch('/api/theme/save', {
    method: 'POST',
    body: {
      primaryColor: primaryColor.value,
      primaryColorHover: primaryColorHover.value,
    },
  })
}

const moveSection = async (id: number, direction: 'up' | 'down') => {
  await $fetch('/api/sections/move', {
    method: 'POST',
    body: {
      id,
      direction,
    },
  })
  refresh()
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
      Sektionen
    </h1>

    <div class="mt-10" v-if="sections">
      <table class="divide-y divide-gray-200 w-full">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sortierung
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(section, index) in sections" :key="section.id">
            <td class="px-3 py-2 whitespace-nowrap flex">
              <div class="w-12">
                <button
                  v-if="index !== sections.length - 1"
                  @click="moveSection(section.id, 'down')" class="button light !px-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                  </svg>
                </button>
              </div>
              <div class="w-12">
                <button
                  v-if="index !== 0"
                  @click="moveSection(section.id, 'up')" class="button light !px-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              {{ section.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>