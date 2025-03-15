<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { websiteFormSchema as schema, type Website } from '~/types'

const props = defineProps<{
  website?: Website
}>()

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: props.website?.id,
  title: props.website?.title,
  subtitle: props.website?.subtitle || '',
  description: props.website?.description || '',
  domain: props.website?.domain || '',
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

    <UFormField label="Domain" name="domain" size="xl">
      <UInput v-model="state.domain" class="w-full" />
      <div class="text-sm text-gray-500 mt-2">
        Noch keine Domain? <ULink href="#" class="text-sky-500">Jetzt registrieren</ULink>
      </div>
    </UFormField>


    <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
      Speichern
    </UButton>
  </UForm>
</template>

