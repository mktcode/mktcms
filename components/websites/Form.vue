<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { websiteFormSchema, websiteContentFormSchema, type NewWebsiteForm, type Website, type WebsiteContent } from '~/types'

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website?: WebsiteWithContents
  suggestions?: NewWebsiteForm | null
}>()

type WebsiteSchema = z.output<typeof websiteFormSchema>
type WebsiteContentSchema = z.output<typeof websiteContentFormSchema>
type NestedFormSchema = Partial<WebsiteSchema & { contents: Partial<WebsiteContentSchema>[] }>

const colors = ref([
  {
    label: 'Rot',
    value: 'red',
  },
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Bernstein',
    value: 'amber',
  },
  {
    label: 'Gelb',
    value: 'yellow',
  },
  {
    label: 'Limette',
    value: 'lime',
  },
  {
    label: 'Grün',
    value: 'green',
  },
  {
    label: 'Smaragd',
    value: 'emerald',
  },
  {
    label: 'Blaugrün',
    value: 'teal',
  },
  {
    label: 'Cyan',
    value: 'cyan',
  },
  {
    label: 'Himmelblau',
    value: 'sky',
  },
  {
    label: 'Blau',
    value: 'blue',
  },
  {
    label: 'Indigo',
    value: 'indigo',
  },
  {
    label: 'Violett',
    value: 'violet',
  },
  {
    label: 'Lila',
    value: 'purple',
  },
  {
    label: 'Fuchsie',
    value: 'fuchsia',
  },
  {
    label: 'Rosa',
    value: 'pink',
  },
  {
    label: 'Rose',
    value: 'rose',
  },
  {
    label: 'Schiefer',
    value: 'slate',
  },
  {
    label: 'Grau',
    value: 'gray',
  },
  {
    label: 'Zink',
    value: 'zinc',
  },
  {
    label: 'Neutral',
    value: 'neutral',
  },
  {
    label: 'Stein',
    value: 'stone',
  },
])

const state = reactive<NestedFormSchema>({
  id: props.website?.id,
  title: props.website?.title || props.suggestions?.title || '',
  subtitle: props.website?.subtitle || '',
  description: props.website?.description || '',
  domain: props.website?.domain || '',
  isOnline: !!props.website?.isOnline,
  hasContactForm: !!props.website?.hasContactForm,
  contactFormSubject: props.website?.contactFormSubject || '',
  font: props.website?.font || 'Roboto',
  showAbout: !!props.website?.showAbout,
  aboutTitle: props.website?.aboutTitle || '',
  aboutSubtitle: props.website?.aboutSubtitle || '',
  aboutText: props.website?.aboutText || '',
  showContents: !!props.website?.showContents,
  primaryColor: props.website?.primaryColor || colors.value[9].value,
  contents: props.website?.contents || [],
})

function addContent() {
  if (!state.contents) {
    state.contents = []
  }
  state.contents.push({
    orderIndex: state.contents.length,
  })
}

function removeContent(index: number) {
  if (!state.contents) {
    return
  }
  state.contents.splice(index, 1)
}

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<NestedFormSchema>) {
  isSaving.value = true
  await $fetch('/api/websites/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/werbung/website')
  toast.add({ title: 'Erfolg.', description: 'Website wurde gespeichert.', color: 'success' })
}
</script>

<template>
  <UForm :schema="websiteFormSchema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
    <UFormField label="Titel" name="title" size="xl">
      <UInput v-model="state.title" class="w-full" />
    </UFormField>

    <UFormField label="Untertitel" name="subtitle" size="xl">
      <UInput v-model="state.subtitle" class="w-full" />
    </UFormField>

    <UFormField label="Kurzbeschreibung" name="description" size="xl">
      <UTextarea v-model="state.description" class="w-full" />
    </UFormField>

    <UCheckbox
      label="Details zum Angebot oder Unternehmen"
      description="Eine weitere Sektion mit Details zum Angebot oder Unternehmen anzeigen."
      name="showAbout"
      v-model="state.showAbout"
    />

    <Transition name="fade">
      <div v-if="state.showAbout" class="flex flex-col gap-4">
        <UFormField label="Title" name="aboutTitle" size="xl">
          <UInput v-model="state.aboutTitle" class="w-full" />
        </UFormField>
  
        <UFormField label="Untertitel" name="aboutSubtitle" size="xl">
          <UInput v-model="state.aboutSubtitle" class="w-full" />
        </UFormField>
  
        <UFormField label="Text" name="aboutText" size="xl">
          <UTextarea v-model="state.aboutText" class="w-full" />
        </UFormField>
      </div>
    </Transition>

    <UCheckbox
      label="Weitere Inhalte als Liste"
      description="Eine weitere Sektion mit einer Raster- oder Listenansicht anzeigen."
      name="showAbout"
      v-model="state.showContents"
    />

    <Transition name="fade">
      <div v-if="state.showContents" class="flex flex-col gap-4">
        <TransitionGroup name="fade">
          <UForm v-for="content, index in state.contents" :key="index" :schema="websiteContentFormSchema" :state="content" class="flex flex-col gap-4">
            <UFormField label="Titel" name="title" size="xl" class="flex-1">
              <UInput v-model="content.title" class="w-full" />
            </UFormField>
            <UFormField label="Untertitel" name="subtitle" size="xl" class="flex-1">
              <UInput v-model="content.subtitle" class="w-full" />
            </UFormField>
            <UFormField label="Text" name="text" size="xl" class="flex-1">
              <UTextarea v-model="content.description" class="w-full" />
            </UFormField>
            <UButton color="error" variant="soft" size="xl" icon="i-heroicons-trash" @click="removeContent(index)">
              Entfernen
            </UButton>
            <UInput v-model="content.orderIndex" type="hidden" class="hidden" />
          </UForm>
        </TransitionGroup>
        <UButton color="primary" variant="soft" size="xl" icon="i-heroicons-plus" @click="addContent">
          Inhalt hinzufügen
        </UButton>
      </div>
    </Transition>

    <UFormField label="Schriftart" name="font" size="xl">
      <USelect v-model="state.font" class="w-full" :items="[ 'Roboto', 'Open Sans', 'Lato' ]" />
    </UFormField>

    <UFormField label="Primärfarbe" name="primaryColor" size="xl">
      <USelect v-model="state.primaryColor" :items="colors" class="w-48">
        <template #leading="{ modelValue }">
          <div :class="`w-4 h-4 rounded-full bg-red-500`" v-if="modelValue === 'red'" />
          <div :class="`w-4 h-4 rounded-full bg-orange-500`" v-if="modelValue === 'orange'" />
          <div :class="`w-4 h-4 rounded-full bg-amber-500`" v-if="modelValue === 'amber'" />
          <div :class="`w-4 h-4 rounded-full bg-yellow-500`" v-if="modelValue === 'yellow'" />
          <div :class="`w-4 h-4 rounded-full bg-lime-500`" v-if="modelValue === 'lime'" />
          <div :class="`w-4 h-4 rounded-full bg-green-500`" v-if="modelValue === 'green'" />
          <div :class="`w-4 h-4 rounded-full bg-emerald-500`" v-if="modelValue === 'emerald'" />
          <div :class="`w-4 h-4 rounded-full bg-teal-500`" v-if="modelValue === 'teal'" />
          <div :class="`w-4 h-4 rounded-full bg-cyan-500`" v-if="modelValue === 'cyan'" />
          <div :class="`w-4 h-4 rounded-full bg-sky-500`" v-if="modelValue === 'sky'" />
          <div :class="`w-4 h-4 rounded-full bg-blue-500`" v-if="modelValue === 'blue'" />
          <div :class="`w-4 h-4 rounded-full bg-indigo-500`" v-if="modelValue === 'indigo'" />
          <div :class="`w-4 h-4 rounded-full bg-violet-500`" v-if="modelValue === 'violet'" />
          <div :class="`w-4 h-4 rounded-full bg-purple-500`" v-if="modelValue === 'purple'" />
          <div :class="`w-4 h-4 rounded-full bg-fuchsia-500`" v-if="modelValue === 'fuchsia'" />
          <div :class="`w-4 h-4 rounded-full bg-pink-500`" v-if="modelValue === 'pink'" />
          <div :class="`w-4 h-4 rounded-full bg-rose-500`" v-if="modelValue === 'rose'" />
          <div :class="`w-4 h-4 rounded-full bg-slate-500`" v-if="modelValue === 'slate'" />
          <div :class="`w-4 h-4 rounded-full bg-gray-500`" v-if="modelValue === 'gray'" />
          <div :class="`w-4 h-4 rounded-full bg-zinc-500`" v-if="modelValue === 'zinc'" />
          <div :class="`w-4 h-4 rounded-full bg-neutral-500`" v-if="modelValue === 'neutral'" />
          <div :class="`w-4 h-4 rounded-full bg-stone-500`" v-if="modelValue === 'stone'" />
        </template>
        <template #item-leading="{ item }">
          <div :class="`w-4 h-4 rounded-full bg-red-500`" v-if="item.value === 'red'" />
          <div :class="`w-4 h-4 rounded-full bg-orange-500`" v-if="item.value === 'orange'" />
          <div :class="`w-4 h-4 rounded-full bg-amber-500`" v-if="item.value === 'amber'" />
          <div :class="`w-4 h-4 rounded-full bg-yellow-500`" v-if="item.value === 'yellow'" />
          <div :class="`w-4 h-4 rounded-full bg-lime-500`" v-if="item.value === 'lime'" />
          <div :class="`w-4 h-4 rounded-full bg-green-500`" v-if="item.value === 'green'" />
          <div :class="`w-4 h-4 rounded-full bg-emerald-500`" v-if="item.value === 'emerald'" />
          <div :class="`w-4 h-4 rounded-full bg-teal-500`" v-if="item.value === 'teal'" />
          <div :class="`w-4 h-4 rounded-full bg-cyan-500`" v-if="item.value === 'cyan'" />
          <div :class="`w-4 h-4 rounded-full bg-sky-500`" v-if="item.value === 'sky'" />
          <div :class="`w-4 h-4 rounded-full bg-blue-500`" v-if="item.value === 'blue'" />
          <div :class="`w-4 h-4 rounded-full bg-indigo-500`" v-if="item.value === 'indigo'" />
          <div :class="`w-4 h-4 rounded-full bg-violet-500`" v-if="item.value === 'violet'" />
          <div :class="`w-4 h-4 rounded-full bg-purple-500`" v-if="item.value === 'purple'" />
          <div :class="`w-4 h-4 rounded-full bg-fuchsia-500`" v-if="item.value === 'fuchsia'" />
          <div :class="`w-4 h-4 rounded-full bg-pink-500`" v-if="item.value === 'pink'" />
          <div :class="`w-4 h-4 rounded-full bg-rose-500`" v-if="item.value === 'rose'" />
          <div :class="`w-4 h-4 rounded-full bg-slate-500`" v-if="item.value === 'slate'" />
          <div :class="`w-4 h-4 rounded-full bg-gray-500`" v-if="item.value === 'gray'" />
          <div :class="`w-4 h-4 rounded-full bg-zinc-500`" v-if="item.value === 'zinc'" />
          <div :class="`w-4 h-4 rounded-full bg-neutral-500`" v-if="item.value === 'neutral'" />
          <div :class="`w-4 h-4 rounded-full bg-stone-500`" v-if="item.value === 'stone'" />
        </template>
      </USelect>
    </UFormField>

    <UFormField label="Domain" name="domain" size="xl">
      <UInput v-model="state.domain" class="w-full" />
      <div class="text-sm text-gray-500 mt-2">
        Noch keine Domain? <ULink href="#" class="text-primary-500">Jetzt registrieren</ULink>
      </div>
    </UFormField>

    <UCheckbox
      label="Kontaktformular"
      description="Hat die Website ein Kontaktformular?"
      name="hasContactForm"
      v-model="state.hasContactForm"
    />

    <Transition name="fade">
      <UFormField label="Betreff" name="contactFormSubject" size="xl" v-if="state.hasContactForm">
        <UInput v-model="state.contactFormSubject" class="w-full" />
      </UFormField>
    </Transition>

    <UCheckbox
      label="Website online"
      description="Ist die Website online und für Besucher sichtbar?"
      name="isOnline"
      v-model="state.isOnline"
    />

    <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
      Speichern
    </UButton>
  </UForm>
</template>

