<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { invoiceInFormSchema as schema, type InvoiceIn, type Supplier } from '~/types'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps<{
  invoice?: InvoiceIn
}>()

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: props.invoice?.id,
  supplierId: props.invoice?.supplierId,
  date: props.invoice?.date,
  status: props.invoice?.status ?? 0,
  discount: props.invoice?.discount ?? 0,
})
const dateModel = shallowRef(new CalendarDate(2025, 1, 10))

const toast = useToast()
const isSaving = ref(false)
const suppliers = ref<Supplier[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const isReadingFile = ref(false)

const fetchPosts = async () => {
  const data = await $fetch('/api/suppliers/list');
  suppliers.value = data;
};
onMounted(fetchPosts);

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

async function readImages() {
  isReadingFile.value = true
  const images = []
  for (const file of files.value) {
    const base64url = await toBase64(file)
    images.push(base64url)
  }

  const imageData = await $fetch('/api/invoicesIn/readImages', {
    method: 'POST',
    body: { images },
  })

  if (imageData.supplierId !== 0) {
    state.supplierId = imageData.supplierId
  }

  if (imageData.date) {
    dateModel.value = new CalendarDate(imageData.date.year, imageData.date.month, imageData.date.day)
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
  <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
    <UFormField label="Rechnung hochladen/fotografieren" name="file" size="xl">
      <UInput
        type="file"
        size="xl"
        ref="fileInput"
        accept="image/*"
        multiple
        capture="environment"
        @change="handleFilesChange"
      />
      <UButton color="primary" size="xl" @click="readImages" :disabled="isReadingFile" :loading="isReadingFile">
        Bild lesen
      </UButton>
    </UFormField>

    <UFormField label="Lieferant" name="supplierId" size="xl">
      <USelectMenu
        v-model="state.supplierId"
        value-key="id"
        label-key="name"
        :items="suppliers"
        size="xl"
        class="w-48"
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

