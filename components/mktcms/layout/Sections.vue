<script setup lang="ts">
import type { Section } from '~/types';

const props = defineProps<{
  pageId: number
}>()

const sections = ref<Section[]>([])
const showNewSectionModal = ref(false)
const newSectionName = ref('')
const newSectionComponent = ref('Header')
const showDeleteModal = ref(false)
const sectionToDelete = ref<Section | null>(null)
const showConnectContentModal = ref(false)
const sectionToConnectContent = ref<Section | null>(null)
const showNewContentModal = ref(false)
const newContentTitle = ref('')

const contentList = await $fetch('/api/content/list', { method: 'POST' })

const fetchSections = async () => {
  sections.value = await $fetch('/api/sections/list', {
    method: 'POST',
    body: {
      pageId: props.pageId,
    },
  });
}

onMounted(fetchSections)

const createContent = async () => {
  const content = await $fetch('/api/content/create', {
    method: 'POST',
    body: {
      title: newContentTitle.value,
    },
  });
  await connectContent(content.id)
  showNewContentModal.value = false
  await fetchSections()
};

const createSection = async () => {
  await $fetch('/api/sections/create', {
    method: 'POST',
    body: {
      pageId: props.pageId,
      component: newSectionComponent.value,
      orderIndex: sections.value.length,
    },
  })
  showNewSectionModal.value = false
  await fetchSections()
}

const moveSection = async (id: number, direction: 'up' | 'down') => {
  await $fetch('/api/sections/move', {
    method: 'POST',
    body: {
      id,
      direction,
    },
  })
  await fetchSections()
}

const deleteSection = async () => {
  if (!sectionToDelete.value) return

  await $fetch('/api/sections/delete', {
    method: 'POST',
    body: { id: sectionToDelete.value.id },
  })
  showDeleteModal.value = false
  await fetchSections()
}

const connectContent = async (contentId: number) => {
  if (!sectionToConnectContent.value) return
  
  await $fetch('/api/sections/update', {
    method: 'POST',
    body: {
      id: sectionToConnectContent.value.id,
      contentId,
    },
  })
  showConnectContentModal.value = false
  await fetchSections()
}
</script>

<template>
  <div class="mt-10">
    <button class="button" @click="showNewSectionModal = true">
      Neue Sektion erstellen
    </button>
    <table class="divide-y divide-gray-200 w-full">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Sortierung
          </th>
          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Inhalte
          </th>
          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200" v-if="sections">
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
            {{ section.component }}
          </td>
          <td v-if="section.contentId">
            {{ contentList.find((content) => content.id === section.contentId)?.title }}
            <button class="button light" @click="sectionToConnectContent = section; showConnectContentModal = true">
              Inhalt verknüpfen
            </button>
          </td>
          <td v-else>
            <button class="button light" @click="sectionToConnectContent = section; showConnectContentModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Inhalt verknüpfen
            </button>
            <button class="button light" @click="showNewContentModal = true; sectionToConnectContent = section">
              Inhalt erstellen
            </button>
          </td>
          <td>
            <button class="button light" @click="showDeleteModal = true; sectionToDelete = section">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <MktcmsModal v-if="showNewContentModal">
      <h1>Inhalt erstellen</h1>
      <p>
        Hier kannst du einen neuen Inhalt erstellen.
      </p>
      <input v-model="newContentTitle" type="text" class="input" placeholder="Titel" />
      <div class="flex justify-end mt-4">
        <button class="button" @click="showNewContentModal = false">
          Abbrechen
        </button>
        <button class="button" @click="createContent">
          Erstellen
        </button>
      </div>
    </MktcmsModal>

    <MktcmsModal v-if="showConnectContentModal">
      <h1>Inhalt verknüpfen</h1>
      <p>
        Wähle einen Inhalt, der in dieser Sektion angezeigt werden soll.
      </p>
      <table>
        <tbody>
          <tr v-for="content in contentList" :key="content.id">
            <td>{{ content.title }}</td>
            <td>
              <button class="button light" @click="connectContent(content.id)">
                Verknüpfen
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </MktcmsModal>

    <MktcmsModal v-if="showNewSectionModal">
      <h1>Neue Sektion erstellen</h1>
      <p>
        Hier kannst du eine neue Sektion erstellen.
      </p>
      <input v-model="newSectionName" type="text" class="input" placeholder="Name" />
      <select v-model="newSectionComponent" class="input mt-2">
        <option>Header</option>
        <option>About</option>
        <option>ContentGrid</option>
        <option>Footer</option>
      </select>
      <div class="flex justify-end mt-4">
        <button class="button" @click="showNewSectionModal = false">
          Abbrechen
        </button>
        <button class="button" @click="createSection">
          Erstellen
        </button>
      </div>
    </MktcmsModal>

    <MktcmsModal v-if="showDeleteModal && sectionToDelete">
      <h1>Sektion löschen</h1>
      <p>
        Möchtest du die Sektion "{{ sectionToDelete.component }}" wirklich löschen?
      </p>
      <div class="flex justify-end mt-4">
        <button class="button" @click="showDeleteModal = false">
          Abbrechen
        </button>
        <button class="button" @click="deleteSection">
          Löschen
        </button>
      </div>
    </MktcmsModal>
  </div>
</template>