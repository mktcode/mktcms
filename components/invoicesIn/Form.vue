<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { invoiceInFormSchema, supplierFormSchema, type Supplier } from '~/types'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { OutputItem as InvoiceInListItem } from '~/server/api/invoicesIn/list.get';
import type { Output as ReadImagesOutput } from '~/server/api/invoicesIn/readImages.post';

const props = defineProps<{
  invoice?: InvoiceInListItem
}>()

type Schema = z.output<typeof invoiceInFormSchema>
type SupplierSchema = z.output<typeof supplierFormSchema>

const state = reactive<Partial<Schema>>({
  id: props.invoice?.id,
  supplierId: props.invoice?.supplierId,
  date: props.invoice?.date,
  status: props.invoice?.status ?? 0,
  amount: props.invoice?.amount ?? 0,
  vat: props.invoice?.vat ?? 0,
})

const supplierState = reactive<Partial<SupplierSchema>>({
  name: '',
  address: '',
  zip: '',
  city: '',
})

const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
)
const dateModel = shallowRef(today)

const imageData = ref<ReadImagesOutput>({
  supplierId: null,
  supplierName: null,
  supplierStreet: null,
  supplierZip: null,
  supplierCity: null,
  date: null,
  totalNet: null,
  totalGross: null,
  totalVat: null,
})

const isConfirmed = ref({
  supplierId: true,
  date: true,
  status: true,
  amount: true,
  vat: true,
})

const toast = useToast()
const isSaving = ref(false)
const isSavingSupplier = ref(false)
const captureFileInput = ref<HTMLInputElement | null>(null)
const uploadFileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const isReadingFile = ref(false)
const showAlert = ref(true)
const showNewSupplierModal = ref(false)

const { data: suppliers, refresh: refreshSuppliers } = await useFetch('/api/suppliers/list')

const df = new DateFormatter('de-DE', {
  dateStyle: 'medium'
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSaving.value = true
  await $fetch('/api/invoicesIn/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/buchhaltung/rechnungen/eingehend')
  toast.add({ title: 'Erfolg.', description: 'Rechnung wurde gespeichert.', color: 'success' })
}

async function onSupplierSubmit() {
  isSavingSupplier.value = true
  const { supplierId } = await $fetch('/api/suppliers/upsert', {
    method: 'POST',
    body: supplierState,
  })
  await refreshSuppliers()
  state.supplierId = supplierId
  isSavingSupplier.value = false
  showNewSupplierModal.value = false
  toast.add({ title: 'Erfolg.', description: 'Lieferant wurde gespeichert.', color: 'success' })
}

async function readImages() {
  isReadingFile.value = true
  const images = []
  for (const file of files.value) {
    const base64url = await toBase64(file)
    images.push(base64url)
  }

  imageData.value = await $fetch('/api/invoicesIn/readImages', {
    method: 'POST',
    body: { images },
  })

  if (
    !imageData.value.supplierId && (
      imageData.value.supplierName ||
      imageData.value.supplierStreet ||
      imageData.value.supplierZip ||
      imageData.value.supplierCity
    )) {
    showNewSupplierModal.value = true
  }

  if (imageData.value.supplierId) {
    state.supplierId = imageData.value.supplierId
    isConfirmed.value.supplierId = false
  }

  if (imageData.value.supplierName) {
    supplierState.name = imageData.value.supplierName
  }

  if (imageData.value.supplierStreet) {
    supplierState.address = imageData.value.supplierStreet
  }

  if (imageData.value.supplierZip) {
    supplierState.zip = imageData.value.supplierZip
  }

  if (imageData.value.supplierCity) {
    supplierState.city = imageData.value.supplierCity
  }

  if (imageData.value.date) {
    dateModel.value = new CalendarDate(imageData.value.date.year, imageData.value.date.month, imageData.value.date.day)
    state.date = dateModel.value.toString()
    isConfirmed.value.date = false
  }

  if (imageData.value.totalNet) {
    state.amount = imageData.value.totalNet
    isConfirmed.value.amount = false
  }

  if (imageData.value.totalVat) {
    state.vat = imageData.value.totalVat
    isConfirmed.value.vat = false
  }

  isReadingFile.value = false
}

function handleFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files)
  }
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', () => resolve(reader.result as string))
    reader.addEventListener('error', reject)
  })
}
</script>

<template>
  <UForm :schema="invoiceInFormSchema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
    <Transition name="fade">
      <UAlert
        v-if="showAlert"
        color="primary"
        icon="i-heroicons-information-circle"
        class="w-full"
        :ui="{ icon: 'size-8' }"
        :close="{ class: 'text-white/75 hover:text-white' }"
        @update:open="showAlert = $event"
      >
        <template #title>
          Lesen Sie Rechnungsdaten aus einem Bild oder einer Datei (PDF, Word) ein. Bei niedriger Bildqualität oder untypischen Formaten können dabei Fehler auftreten. Überprüfen Sie anschließend die Daten und passen Sie sie ggf. an.
        </template>
      </UAlert>
    </Transition>

    <div class="flex flex-col md:flex-row gap-4">
      <UFormField label="Foto machen" name="file" size="xl" class="md:hidden">
        <UInput
          type="file"
          size="xl"
          ref="captureFileInput"
          accept="image/*"
          multiple
          capture="environment"
          @change="handleFilesChange"
        />
      </UFormField>
  
      <UFormField label="Foto oder Datei hochladen" name="file" size="xl">
        <UInput
          type="file"
          size="xl"
          ref="uploadFileInput"
          accept="image/*"
          multiple
          @change="handleFilesChange"
        />
      </UFormField>
    </div>

    <UButton
      color="primary"
      size="xl"
      @click="readImages"
      :disabled="isReadingFile || files.length === 0"
      :loading="isReadingFile"
    >
      Daten einlesen
    </UButton>

    <UModal
      v-model:open="showNewSupplierModal"
      title="Neuen Lieferanten anlegen"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField label="Name" name="supplierName" size="xl">
            <UInput v-model="supplierState.name" class="w-full" />
          </UFormField>
          <div class="flex gap-4">
            <UFormField label="Straße" name="supplierStreet" size="xl">
              <UInput v-model="supplierState.address" class="w-full" />
            </UFormField>
            <UFormField label="PLZ" name="supplierZip" size="xl">
              <UInput v-model="supplierState.zip" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Ort" name="supplierCity" size="xl">
            <UInput v-model="supplierState.city" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between w-full gap-4">
          <UButton color="error" variant="ghost" size="xl" @click="showNewSupplierModal = false">
            Abbrechen
          </UButton>
          <UButton color="primary" size="xl" @click="onSupplierSubmit" :loading="isSavingSupplier">
            Lieferant anlegen
          </UButton>
        </div>
      </template>
    </UModal>
    
    <div class="flex items-end gap-4" v-if="suppliers">
      <UFormField label="Lieferant" name="supplierId" size="xl" class="w-full">
        <USelectMenu
          v-model="state.supplierId"
          value-key="id"
          label-key="name"
          :items="suppliers"
          size="xl"
          class="w-full"
        />
        <div>
          <UButton variant="link" color="primary" class="px-0" @click="showNewSupplierModal = true">
            Neuen Lieferanten anlegen
          </UButton>
        </div>
      </UFormField>
      <UButton color="primary" size="xl" @click="isConfirmed.supplierId = true" v-if="!isConfirmed.supplierId">
        Bestätigen
      </UButton>
    </div>

    <div class="flex items-end gap-4">
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
      <UButton color="primary" size="xl" @click="isConfirmed.date = true" v-if="!isConfirmed.date">
        Bestätigen
      </UButton>
    </div>

    <div class="flex items-end gap-4">
      <UFormField label="Nettobetrag" name="amount" size="xl">
        <UInputNumber
          v-model="state.amount"
          :format-options="{
            minimumFractionDigits: 2,
          }"
          :min="0"
          :step="0.01"
          size="xl"
        />
      </UFormField>
      <UButton color="primary" size="xl" @click="isConfirmed.amount = true" v-if="!isConfirmed.amount">
        Bestätigen
      </UButton>
    </div>

    <div class="flex items-end gap-4">
      <UFormField label="MwSt." name="vat" size="xl">
        <UInputNumber
          v-model="state.vat"
          :format-options="{
            minimumFractionDigits: 2,
          }"
          :min="0"
          :step="0.01"
          size="xl"
        />
      </UFormField>
      <UButton color="primary" size="xl" @click="isConfirmed.vat = true" v-if="!isConfirmed.vat">
        Bestätigen
      </UButton>
    </div>

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

    <UButton
      :disabled="isSaving || Object.values(isConfirmed).some((v) => v === false)"
      :loading="isSaving"
      type="submit"
      color="primary"
      icon="i-heroicons-check"
      size="xl"
    >
      Speichern
    </UButton>
  </UForm>
</template>

