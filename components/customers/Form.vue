<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { customerFormSchema as schema, type Customer } from '~/types'

const props = defineProps<{
  customer?: Customer
}>()

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: props.customer?.id,
  name: props.customer?.name,
  address: props.customer?.address,
  zip: props.customer?.zip,
  city: props.customer?.city,
  phone: props.customer?.phone ?? '',
  email: props.customer?.email ?? '',
})

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSaving.value = true
  await $fetch('/api/customers/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/kunden')
  toast.add({ title: 'Erfolg.', description: 'Kunde wurde gespeichert.', color: 'success' })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" ref="customer-form" @submit="onSubmit">
    <UFormField label="Name" name="name" size="xl">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <UFormField label="Adresse" name="address" size="xl">
      <UInput v-model="state.address" class="w-full" />
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
</template>

