<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { vcardFormSchema as schema, type Vcard } from '~/types'

const props = defineProps<{
  vcard?: Vcard
}>()

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: props.vcard?.id,
  title: props.vcard?.title ?? '',
  street: props.vcard?.street ?? '',
  zip: props.vcard?.zip ?? '',
  city: props.vcard?.city ?? '',
  phone: props.vcard?.phone ?? '',
  email: props.vcard?.email ?? '',
  hasBack: false,
})

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSaving.value = true
  await $fetch('/api/vcards/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/werbung/print')
  toast.add({ title: 'Erfolg.', description: 'Visitenkarte wurde gespeichert.', color: 'success' })
}
</script>

<template>
  <div class="flex gap-8">
    <div>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Titel" name="title" size="xl">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
    
        <UFormField label="Straße" name="street" size="xl">
          <UInput v-model="state.street" class="w-full" />
        </UFormField>
    
        <div class="flex gap-4">
          <UFormField label="PLZ" name="zip" size="xl">
            <UInput v-model="state.zip" class="w-full" />
          </UFormField>
      
          <UFormField label="Ort" name="city" size="xl" class="grow">
            <UInput v-model="state.city" class="w-full" />
          </UFormField>
        </div>
    
        <UFormField label="Telefon" name="phone" size="xl">
          <UInput v-model="state.phone" class="w-full" />
        </UFormField>
    
        <UFormField label="Email" name="email" size="xl">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>
    
        <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
          Speichern
        </UButton>
      </UForm>
    </div>
    <div class="grow flex items-center justify-center">
      <div class="border-dashed border-gray-300 border w-96">
        <PrintVcard
          :logo-width="120"
          :title="state.title || 'Meine Firma'"
          subtitle="Meine Firma"
          slogan="Musterslogan"
          description="Musterbeschreibung"
          :street="state.street || 'Musterstraße 123'"
          :zip="state.zip || '12345'"
          :city="state.city || 'Musterstadt'"
          :phone="state.phone || '0123456789'"
          :email="state.email || 'kontakt@beispiel.com'"
        />
      </div>
    </div>
  </div>
</template>

