<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { invoiceItemFormSchema, type InvoiceItem } from '~/types'

const props = defineProps<{
  invoiceItem?: InvoiceItem
}>()

type Schema = z.output<typeof invoiceItemFormSchema>

const state = reactive<Partial<Schema>>({
  id: props.invoiceItem?.id,
  title: props.invoiceItem?.title,
  description: props.invoiceItem?.description ?? '',
  price: props.invoiceItem?.price,
  unit: props.invoiceItem?.unit ?? 'Stück',
})

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSaving.value = true
  await $fetch('/api/invoiceItems/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/buchhaltung/rechnungen/artikel')
  toast.add({ title: 'Erfolg.', description: 'Artikel wurde gespeichert.', color: 'success' })
}
</script>

<template>
  <UForm :schema="invoiceItemFormSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Titel" name="title" size="xl">
      <UInput v-model="state.title" class="w-full" />
    </UFormField>

    <UFormField label="Beschreibung" name="description" size="xl">
      <UTextarea v-model="state.description" class="w-full" />
    </UFormField>

    <UFormField label="Standardpreis" name="price" size="xl">
      <UInputNumber
        v-model="state.price"
        :format-options="{
          minimumFractionDigits: 2,
        }"
        :min="0"
        :step="0.01"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Einheit" name="unit" size="xl">
      <UInput v-model="state.unit" class="w-full" />
    </UFormField>

    <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
      Speichern
    </UButton>
  </UForm>
</template>

