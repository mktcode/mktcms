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

const { data: pages, refresh: refreshPages } = await useFetch('/api/pages/list', { method: 'POST' });
const { data: sections, refresh: refreshSections } = await useFetch('/api/sections/list', { method: 'POST' });

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
  refreshSections()
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
      Seiten
    </h1>
    <p class="text-gray-500">
      Ihre Website besteht aus Seiten und Seiten bestehen aus Sektionen. Es gibt zwei Arten von Seiten und eine Vielzahl von unterschiedlichen Sektionen.
    </p>
    <h2 class="text-2xl font-bold mb-4 mt-6">
      Statische Seiten
    </h2>
    <p class="text-gray-500">
      Statische Seiten haben eine feste Adresse und zeigen Sektionen mit festgelegten Inhalten an. Die Startseite ist z.B. eine solche statische Seite.
      Sie ist immer unter <span class="italic">ihre-domain.de</span> zu erreichen und zeigt die Inhalte an, die dafür konfiguriert wurden.
      Sie könnten auch eine Seite über Ihre Unternehmensgeschichte anlegen, die dann immer unter <span class="italic">ihre-domain.de/geschichte</span> erreichbar ist.
    </p>

    <h2 class="text-2xl font-bold mb-4 mt-6">
      Dynamische Seiten
    </h2>
    <p class="text-gray-500">
      Die Inhalte einer dynamischen Seite können über die Adresse gesteuert werden.
      Sie könnten z.B. unter <span class="italic">ihre-domain.de/angebote/&lt;angebotsname&gt;</span> verschiedene Angebote anzeigen,
      ohne für jedes eine eigene Seite anlegen zu müssen. Sie müssen nur in den Einstellungen einer Inhaltskategorie die Optionen "Übersichtsseite" und "Detailseiten" aktivieren.
    </p>

    <div class="mt-10" v-if="pages">
      <table class="divide-y divide-gray-200 w-full">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Typ
            </th>
            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresse
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(page, index) in pages" :key="page.id">
            <td class="px-3 py-2 whitespace-nowrap">
              {{ page.title }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              {{ page.type }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              {{ page.slug }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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