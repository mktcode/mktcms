<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { vcardFormSchema as schema, type Vcard } from '~/types'

const props = defineProps<{
  vcard?: Vcard
}>()

type Schema = z.output<typeof schema>

const { public: { s3Endpoint } } = useRuntimeConfig()
const { data: files } = await useFetch('/api/files')
const showImageModal = ref(false)

function selectImage(key: string) {
  state.image = key
  showImageModal.value = false
}

const state = reactive<Partial<Schema>>({
  id: props.vcard?.id,
  image: props.vcard?.image ?? '',
  title: props.vcard?.title ?? '',
  subtitle: props.vcard?.subtitle ?? '',
  slogan: props.vcard?.slogan ?? '',
  street: props.vcard?.street ?? '',
  zip: props.vcard?.zip ?? '',
  city: props.vcard?.city ?? '',
  phone: props.vcard?.phone ?? '',
  email: props.vcard?.email ?? '',
  website: props.vcard?.website ?? '',
  hasBack: !!props.vcard?.hasBack,
  backLogo: !!props.vcard?.backLogo,
  backTitle: props.vcard?.backTitle ?? '',
  backText: props.vcard?.backText ?? '',
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
        <div class="flex flex-col items-start gap-4">
          <img v-if="state.image" :src="`${s3Endpoint}/mktcms/${state.image}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg" />
          <div class="flex items-start gap-4">
            <UModal v-model:open="showImageModal" title="Bild auswählen" icon="i-heroicons-photo" size="xl">
              <UButton label="Bild auswählen" icon="i-heroicons-photo" />
  
              <template #body>
                <div class="grid grid-cols-3 gap-4">
                  <div v-for="file in files" :key="file.key" class="cursor-pointer" @click="selectImage(file.key)">
                    <img :src="`${s3Endpoint}/mktcms/${file.key}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg opacity-90 hover:opacity-100" />
                  </div>
                </div>
              </template>
            </UModal>
            <UButton
              v-if="state.image"
              label="Bild entfernen"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="state.image = ''"
            />
          </div>
        </div>

        <UFormField label="Titel" name="title" size="xl">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField label="Untertitel" name="subtitle" size="xl">
          <UInput v-model="state.subtitle" class="w-full" />
        </UFormField>

        <UFormField label="Slogan" name="slogan" size="xl">
          <UInput v-model="state.slogan" class="w-full" />
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

        <UFormField label="Website" name="website" size="xl">
          <UInput v-model="state.website" class="w-full" />
          <div class="text-sm text-gray-500 mt-2">
            Noch keine Domain? <ULink href="#" class="text-sky-500">Jetzt registrieren</ULink>
          </div>
        </UFormField>

        <UCheckbox
          label="Rückseite"
          name="hasBack"
          v-model="state.hasBack"
        />

        <template v-if="state.hasBack">
          <UCheckbox
            label="Logo auf Rückseite"
            name="backLogo"
            v-model="state.backLogo"
          />

          <UFormField label="Titel Rückseite" name="backTitle" size="xl">
            <UInput v-model="state.backTitle" class="w-full" />
          </UFormField>

          <UFormField label="Text Rückseite" name="backText" size="xl">
            <UTextarea v-model="state.backText" class="w-full" />
          </UFormField>
        </template>
    
        <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
          Speichern
        </UButton>
      </UForm>
    </div>
    <div class="grow flex flex-col gap-2 items-center justify-center">
      <div class="border-dashed border-gray-300 border w-96 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:rotate-3 hover:border-transparent">
        <PrintVcard
          :logo-width="120"
          :image="state.image || ''"
          :title="state.title || 'Meine Firma'"
          :subtitle="state.subtitle || 'Untertitel'"
          :slogan="state.slogan || 'Slogan'"
          :street="state.street || 'Musterstraße 123'"
          :zip="state.zip || '12345'"
          :city="state.city || 'Musterstadt'"
          :phone="state.phone || '0123456789'"
          :email="state.email || 'kontakt@beispiel.com'"
          :website="state.website || 'www.beispiel.com'"
        />
      </div>
      <div v-if="state.hasBack" class="border-dashed border-gray-300 border w-96 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:rotate-3 hover:border-transparent">
        <PrintVcardBack
          :show-logo="!!state.backLogo"
          :title="state.backTitle || 'Rückseite'"
          :text="state.backText || 'Musterbeschreibung'"
        />
      </div>
    </div>
  </div>
</template>

