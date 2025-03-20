<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { websiteFormSchema as schema, type NewWebsiteForm, type Website } from '~/types'

const props = defineProps<{
  website?: Website
  suggestions?: NewWebsiteForm | null
}>()

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: props.website?.id,
  title: props.website?.title || props.suggestions?.title || '',
  subtitle: props.website?.subtitle || '',
  description: props.website?.description || '',
  domain: props.website?.domain || '',
  isOnline: !!props.website?.isOnline,
  hasContactForm: !!props.website?.hasContactForm,
  contactFormSubject: props.website?.contactFormSubject || '',
  font: props.website?.font || 'Roboto',
})

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
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
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Titel" name="title" size="xl">
      <UInput v-model="state.title" class="w-full" />
    </UFormField>

    <UFormField label="Untertitel" name="subtitle" size="xl">
      <UInput v-model="state.subtitle" class="w-full" />
    </UFormField>

    <UFormField label="Beschreibung" name="description" size="xl">
      <UTextarea v-model="state.description" class="w-full" />
    </UFormField>

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

