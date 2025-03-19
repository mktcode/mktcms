<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { invoiceOutFormSchema as schema, type Customer, type InvoiceOut } from '~/types'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps<{
  invoice?: InvoiceOut
}>()

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: props.invoice?.id,
  customerId: props.invoice?.customerId,
  date: props.invoice?.date,
  status: props.invoice?.status,
  discount: props.invoice?.discount,
  items: [],
})
const dateModel = shallowRef(new CalendarDate(2025, 1, 10))

const toast = useToast()
const isSaving = ref(false)
const customers = ref<Customer[]>([])

const fetchPosts = async () => {
  const data = await $fetch('/api/customers/list');
  customers.value = data;
};
onMounted(fetchPosts);

const df = new DateFormatter('de-DE', {
  dateStyle: 'medium'
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSaving.value = true
  await $fetch('/api/invoicesOut/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/buchhaltung/rechnungen/ausgehend')
  toast.add({ title: 'Erfolg.', description: 'Rechnung wurde gespeichert.', color: 'success' })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
    <UFormField label="Kunde" name="customerId" size="xl">
      <USelectMenu
        v-model="state.customerId"
        value-key="id"
        label-key="name"
        :items="customers"
        size="xl"
        class="w-48"
      />
    </UFormField>

    {{ state.date }}

    <UFormField label="Datum" name="date" size="xl">
      <UPopover>
        <UButton color="neutral" variant="outline" icon="i-lucide-calendar" size="xl">
          {{ dateModel ? df.format(dateModel.toDate(getLocalTimeZone())) : 'Wähle ein Datum' }}
        </UButton>
  
        <template #content>
          <UCalendar v-model="dateModel" class="p-2" @update:model-value="state.date = dateModel?.toString()" />
        </template>
      </UPopover>
    </UFormField>

    <UFormField label="Status" name="status" size="xl">
      <USelect
        v-model="state.status"
        value-key="value"
        label-key="label"
        :items="[
          { label: 'Offen', value: 0 },
          { label: 'Bezahlt', value: 1 },
          { label: 'Storniert', value: 2 }
        ]"
        size="xl"
        class="w-48"
      />
    </UFormField>

    <UFormField label="Rabatt" name="discount" size="xl">
      <UInput v-model="state.discount" type="number" size="xl" />
    </UFormField>

    <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
      Speichern
    </UButton>
  </UForm>
</template>

