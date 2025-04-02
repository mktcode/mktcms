<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { invoiceOutFormSchema, invoiceItemRelationFormSchema, type Customer, type InvoiceItem, type InvoiceOutWithItemRelations } from '~/types'

// TODO: require at least one item

const props = defineProps<{
  invoice?: InvoiceOutWithItemRelations
}>()

type InvoiceOutSchema = z.output<typeof invoiceOutFormSchema>
type InvoiceItemRelationSchema = z.output<typeof invoiceItemRelationFormSchema>
type NestedFormSchema = Partial<InvoiceOutSchema & { items: Partial<InvoiceItemRelationSchema>[] }>

const state = reactive<NestedFormSchema>({
  id: props.invoice?.id,
  customerId: props.invoice?.customerId,
  date: props.invoice?.date ?? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
  status: props.invoice?.status ?? 0,
  discount: props.invoice?.discount ?? 0,
  items: props.invoice?.items ?? [],
})

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
      date: date.toISOString().split('T')[0],
      price: item.price,
      quantity: 1,
    })
  }
}

const total = computed(() => {
  return state.items?.reduce((acc, item) => {
    const itemPrice = items.value.find((i) => i.id === item.itemId)?.price ?? 0
    return acc + itemPrice * (item.quantity ?? 0) * (1 - (state.discount ?? 0) / 100)
  }, 0) ?? 0
})

const sampleInvoiceNumber = getDateBasedInvoiceNumber()
</script>

<template>
  <UForm :schema="invoiceOutFormSchema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
    <ClientOnly>
      <LayoutDismissableAlert title="Ihre erste Rechnung" storage-key="showWelcomeMessage.firstInvoice">
        <p>
          Eine Rechnungsnummer wird automatisch auf Basis des Datums und der Uhrzeit zum Zeitpunkt des ersten Speicherns generiert.
          Aktuell wäre das die Rechnungsnummer <strong>{{ sampleInvoiceNumber }}</strong>.
          So können Sie sicher sein, dass jede Rechnung eine eindeutige und fortlaufende Nummer hat.
        </p>
      </LayoutDismissableAlert>
    </ClientOnly>

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
        <LayoutDatepicker v-model="state.date" size="xl" />
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

    <div class="my-6 flex flex-col gap-4">
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
          <LayoutDatepicker v-model="relation.date" size="xl" />
        </UFormField>
        <UFormField label="Preis" name="price" size="xl">
          <UInputNumber
            v-model="relation.price"
            :format-options="{
              minimumFractionDigits: 2,
            }"
            :min="0"
            :step="0.01"
          />
        </UFormField>
        <UFormField :label="`Menge (${items.find((item) => item.id === relation.itemId)?.unit})`" name="quantity" size="xl">
          <UInput v-model="relation.quantity" type="number" />
        </UFormField>
        <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="xl" @click="state.items?.splice(count, 1)" class="self-end">
          Entfernen
        </UButton>
      </UForm>
    </div>

    <UFormField label="Status" name="status" size="xl">
      <USelect
        v-model="state.status"
        value-key="value"
        label-key="label"
        :items="Object.entries(invoiceStatus).map(([key, value]) => ({
          value: Number(key),
          label: value,
        }))"
        size="xl"
        class="w-48"
      />
    </UFormField>

    <Transition name="fade">
      <UAlert color="primary" v-if="(!invoice || invoice.status === 0) && state.status !== 0">
        <template #description>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-exclamation-triangle" size="24" />
              <h3 class="text-lg font-bold">
                Achtung
              </h3>
            </div>
            <p class="text-lg">
              Wird der Staus geändert, gilt die Rechnung als final und kann nicht mehr bearbeitet werden!
              Der Status wird automatisch auf "Offen" gesetzt, wenn die Rechnung aus Solihost heraus per E-Mail an den Kunden verschickt wird.
              Haben Sie die Rechnung auf anderem Weg verschickt, können Sie den Status hier manuell setzen.
            </p>
          </div>
        </template>
      </UAlert>
    </Transition>

    <UFormField label="Rabatt" name="discount" size="xl">
      <UInputNumber v-model="state.discount" size="xl" />
    </UFormField>

    <div class="font-bold text-2xl flex justify-end">
      <div class="grid grid-cols-2 gap-x-4">
        <div>Netto</div>
        {{ formatPrice(total / 1.19) }}
        <div>Brutto</div>
        {{ formatPrice(total) }}

      </div>
    </div>

    <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
      Speichern
    </UButton>
  </UForm>
</template>

