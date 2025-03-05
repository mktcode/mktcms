<script setup lang="ts">
import type { Content } from '~/types';
import Editor from '../Editor.vue';

const props = defineProps<{
  content?: Content;
}>();

const emit = defineEmits<{
  submit: [data: {
    title: string;
    subtitle: string | null;
    description: string | null;
    url: string | null;
  }]
}>()

const title = ref(props.content?.title ?? 'Neuer Inhalt')
const subtitle = ref(props.content?.subtitle ?? null)
const description = ref(props.content?.description ?? null)
const url = ref(props.content?.url ?? null)

const showMore = ref(false);

const submit = async () => {
  emit('submit', {
    title: title.value,
    subtitle: subtitle.value,
    description: description.value,
    url: url.value,
  });
};
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhalt bearbeiten
      </h1>
      <NuxtLink to="/content" class="button ml-auto">Zurück</NuxtLink>
    </div>

    <div class="mt-10">
      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
          <input v-model="title" type="text" name="title" id="title" class="text-lg font-bold">
        </div>

        <div>
          <label for="subtitle" class="block text-sm font-medium text-gray-700">Untertitel</label>
          <input v-model="subtitle" type="text" name="subtitle" id="subtitle" class="font-semibold text-gray-600">
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <ClientOnly>
            <Editor v-model="description" />
          </ClientOnly>
        </div>

        <button @click="showMore = !showMore" type="button" class="button light">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" :class="{ 'transform rotate-180': showMore }">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>

          <template v-if="showMore">Erweiterte Optionen ausblenden</template>
          <template v-else>Erweiterte Optionen einblenden</template>
        </button>

        <Transition name="fade">
          <div v-if="showMore" class="flex flex-col gap-4">
            <div>
              <label for="url" class="block text-sm font-medium text-gray-700">URL</label>
              <input v-model="url" type="text" name="url" id="url">
            </div>
          </div>
        </Transition>

        <button type="submit" class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Website aktualisieren
        </button>
      </form>
    </div>
  </div>
</template>