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
const subtitle = ref(props.content?.subtitle ?? '')
const description = ref(props.content?.description ?? '')
const url = ref(props.content?.url ?? '')

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
    <div class="flex flex-col">
      <UButton to="/content" icon="i-heroicons-arrow-left" variant="ghost" class="mr-auto mb-2">
        Zurück
      </UButton>
      <h1 class="text-3xl font-bold text-gray-900">
        Inhalt bearbeiten
      </h1>
    </div>

    <div class="mt-10">
      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <UFormField label="Titel">
          <UInput placeholder="Neuer Inhalt" v-model="title" size="xl" />
        </UFormField>

        <UFormField label="Untertitel">
          <UInput placeholder="Untertitel" v-model="subtitle" size="xl" />
        </UFormField>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <ClientOnly>
            <Editor v-model="description" />
          </ClientOnly>
        </div>

        <UButton @click="showMore = !showMore" type="button" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" :class="{ 'transform rotate-180': showMore }">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>

          <template v-if="showMore">Erweiterte Optionen ausblenden</template>
          <template v-else>Erweiterte Optionen einblenden</template>
        </UButton>

        <Transition name="fade">
          <div v-if="showMore" class="flex flex-col gap-4">
            <UFormField label="URL">
              <UInput placeholder="URL" v-model="url" size="xl" />
            </UFormField>
          </div>
        </Transition>

        <UButton type="submit" class="button" icon="i-heroicons-check" size="xl">
          Website aktualisieren
        </UButton>
      </form>
    </div>
  </div>
</template>