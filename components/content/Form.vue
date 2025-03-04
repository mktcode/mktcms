<script setup lang="ts">
import type { Content } from '~/types';
import Editor from '../Editor.vue';

const props = defineProps<{
  content?: Content;
}>();

const emit = defineEmits<{
  submit: [data: {
    title: string;
    description: string | null;
    date: string | null;
    url: string | null;
  }]
}>()

const title = ref(props.content?.title ?? 'Neuer Inhalt')
const description = ref(props.content?.description ?? null)
const date = ref(props.content?.date ?? null)
const url = ref(props.content?.url ?? null)

const submit = async () => {
  emit('submit', {
    title: title.value,
    description: description.value,
    date: date.value,
    url: url.value,
  });
};
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Inhaltsverwaltung - Bearbeiten
      </h1>
      <NuxtLink to="/content" class="button ml-auto">Zurück</NuxtLink>
    </div>

    <div class="mt-10">
      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
          <input v-model="title" type="text" name="title" id="title">
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <ClientOnly>
            <Editor v-model="description" />
          </ClientOnly>
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Datum</label>
          <input v-model="date" type="date" name="date" id="date">
        </div>

        <div>
          <label for="url" class="block text-sm font-medium text-gray-700">URL</label>
          <input v-model="url" type="text" name="url" id="url">
        </div>

        <button type="submit" class="button">Aktualisieren</button>
        &#8203;
      </form>
    </div>
  </div>
</template>