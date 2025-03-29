<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { domainFormSchema, type Domain } from '~/types'

const props = defineProps<{
  domain?: Domain
}>()

type Schema = z.output<typeof domainFormSchema>

const state = reactive<Partial<Schema>>({
  id: props.domain?.id,
  domain: props.domain?.domain,
  authcode: props.domain?.authcode,
})

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSaving.value = true
  await $fetch('/api/domains/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/einstellungen/domains')
  toast.add({ title: 'Erfolg.', description: 'Domain wurde gespeichert.', color: 'success' })
}
</script>

<template>
  <UForm :schema="domainFormSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Domain" name="domain" size="xl">
      <UInput v-model="state.domain" class="w-full" />
    </UFormField>

    <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
      Speichern
    </UButton>
  </UForm>
</template>

