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

    <UFormField label="Domain" name="domain" size="xl">
      <UInput v-model="state.domain" class="w-full" />
      <div class="text-sm text-gray-500 mt-2">
        Noch keine Domain? <ULink href="#" class="text-sky-500">Jetzt registrieren</ULink>
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

