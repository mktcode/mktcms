<script setup lang="ts">
import type { Section } from '~/types';

const props = withDefaults(defineProps<{
  route?: string | null
  categoryId?: number | null
  isDetailsPage?: boolean
}>(), {
  route: null,
  categoryId: null,
  isDetailsPage: false,
})

const sections = ref<Section[]>([])

const fetchSections = async () => {
  sections.value = await $fetch('/api/sections/list', {
    method: 'POST',
    body: {
      route: props.route,
      categoryId: props.categoryId,
      isDetailsPage: props.isDetailsPage,
    },
  });
}

onMounted(fetchSections)

const moveSection = async (id: number, direction: 'up' | 'down') => {
  await $fetch('/api/sections/move', {
    method: 'POST',
    body: {
      id,
      direction,
      route: props.route,
      categoryId: props.categoryId,
      isDetailsPage: props.isDetailsPage,
    },
  })
  await fetchSections()
}
</script>

<template>
  <div class="mt-10" :key="`${props.route}-${props.categoryId}-${props.isDetailsPage}`">
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
            {{ section.name }}
          </td>
          <td>
            <button class="button light">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Inhalt erstellen
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>