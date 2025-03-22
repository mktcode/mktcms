<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { invoiceOutFormSchema, invoiceItemRelationFormSchema, type Customer, type InvoiceItem, type InvoiceOut, type InvoiceItemRelation } from '~/types'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

type InvoiceOutWithItemRelations = InvoiceOut & { items: InvoiceItemRelation[] }

const props = defineProps<{
  invoice?: InvoiceOutWithItemRelations
}>()

type InvoiceOutSchema = z.output<typeof invoiceOutFormSchema>
type InvoiceItemRelationSchema = z.output<typeof invoiceItemRelationFormSchema>
type NestedFormSchema = Partial<InvoiceOutSchema & { items: Partial<InvoiceItemRelationSchema>[] }>

const state = reactive<NestedFormSchema>({
  id: props.invoice?.id,
  customerId: props.invoice?.customerId,
  date: props.invoice?.date,
  status: props.invoice?.status ?? 0,
  discount: props.invoice?.discount ?? 0,
  items: props.invoice?.items ?? [],
})

const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
)
const dateModel = shallowRef(today)

const toast = useToast()
const isSaving = ref(false)
const customers = ref<Customer[]>([])
const items = ref<InvoiceItem[]>([])
const selectedItem = ref<number>(0)

const fetchCustomers = async () => {
  const data = await $fetch('/api/customers/list');
  customers.value = data;

  if (state.customerId === undefined && customers.value.length > 0) {
    state.customerId = customers.value[0].id;
  }
};
const fetchInvoiceItems = async () => {
  const data = await $fetch('/api/invoiceItems/list');
  items.value = data;

  if (items.value.length > 0) {
    selectedItem.value = items.value[0].id;
  }
};
onMounted(() => {
  fetchCustomers();
  fetchInvoiceItems();
});

const df = new DateFormatter('de-DE', {
  dateStyle: 'medium'
})

async function onSubmit(event: FormSubmitEvent<NestedFormSchema>) {
  isSaving.value = true
  await $fetch('/api/invoicesOut/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/buchhaltung/rechnungen/ausgehend')
  toast.add({ title: 'Erfolg.', description: 'Rechnung wurde gespeichert.', color: 'success' })
}

function addInvoiceItem() {
  const item = items.value.find((item) => item.id === selectedItem.value)
  const date = state.date ? new Date(state.date) : new Date()
  if (item && state.items) {
    state.items.push({
      itemId: item.id,
      date: date.toISOString(),
      price: item.price,
      quantity: 1,
    })
  }
}
</script>

<template>
  <UForm :schema="invoiceOutFormSchema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
    <div class="flex flex-col sm:flex-row gap-4">
      <UFormField label="Kunde" name="customerId" size="xl">
        <USelectMenu
          v-model="state.customerId"
          value-key="id"
          label-key="name"
          :items="customers"
          size="xl"
          class="w-64"
        />
      </UFormField>
  
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
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <UFormField label="Artikel" name="items" size="xl">
        <USelectMenu
          v-model="selectedItem"
          value-key="id"
          label-key="title"
          :items="items"
          size="xl"
          class="w-64"
        />
      </UFormField>
      <UButton icon="i-heroicons-plus" size="xl" class="self-end" @click="addInvoiceItem">
        Hinzufügen
      </UButton>
    </div>

    <UForm
      v-for="relation, count in state.items"
      :key="count"
      :state="relation"
      :schema="invoiceItemRelationFormSchema"
      class="flex gap-4"
    >
      <div class="flex-1">
        <div class="font-bold">
          {{ items.find((item) => item.id === relation.itemId)?.title }}
        </div>
        <div>
          {{ items.find((item) => item.id === relation.itemId)?.description }}
        </div>
      </div>
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
      <UFormField label="Preis" name="price" size="xl">
        <UInput v-model="relation.price" type="number" />
      </UFormField>
      <UFormField :label="`Menge (${items.find((item) => item.id === relation.itemId)?.unit})`" name="quantity" size="xl">
        <UInput v-model="relation.quantity" type="number" />
      </UFormField>
      <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="xl" @click="state.items?.splice(count, 1)" class="self-end">
        Entfernen
      </UButton>
    </UForm>

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

