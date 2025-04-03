<script setup lang="ts">
import { z } from 'zod';

const formSchema = z.object({
  aboutTargetGroup: z.string().optional(),
  offerShortDescription: z.string().optional(),
  offerDetails: z.string().optional(),
  companyValues: z.string().optional(),
  communicationTone: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const state = reactive<FormSchema>({
  aboutTargetGroup: '',
  offerShortDescription: '',
  offerDetails: '',
  companyValues: '',
  communicationTone: '',
})

const generateWebsite = ref(true)
const generateVcard = ref(true)
const toast = useToast()
const isUpdating = ref(false)

async function load() {
  const existingPrepareContent = await $fetch('/api/prepareContent')
  if (existingPrepareContent) {
    state.aboutTargetGroup = existingPrepareContent.aboutTargetGroup || ''
    state.offerShortDescription = existingPrepareContent.offerShortDescription || ''
    state.offerDetails = existingPrepareContent.offerDetails || ''
    state.companyValues = existingPrepareContent.companyValues || ''
    state.communicationTone = existingPrepareContent.communicationTone || ''
  }
}


async function update() {
  isUpdating.value = true
  await $fetch('/api/prepareContent/upsert', {
    method: 'POST',
    body: {
      prepareContent: state,
      generateWebsite: generateWebsite.value,
      generateVcard: generateVcard.value,
    },
  })
  isUpdating.value = false
  toast.add({
    title: 'Einstellungen gespeichert',
    description: `Ihre Einstellungen wurden erfolgreich gespeichert.${generateWebsite.value ? ' Die Website wurde erstellt.' : ''}${generateVcard.value ? ' Die Visitenkarte wurde erstellt.' : ''}`,
    color: 'success',
  })
}

onMounted(load)
</script>

<template>
  <div>
    <div class="p-6 flex flex-col gap-4">
      <p>
        Du kannst hier <strong>ganz formlos, stichpunktartig oder ausformuliert,</strong> weitere Angaben zu deinem Unternehmen und deinen Dienstleistungen machen.
        Stell dir vor, du erklärst einer befreundeten Person, was du machst.
        Das dient als Vorbereitung und Planung deiner Inhalte und Botschaften.
        Website und Visitenkarten werden dann automatisch mit sinnvollen Inhalten gefüllt. Im besten Fall musst du nur noch ein paar Kleinigkeiten anpassen.
        Du musst nicht alles ausfüllen aber je mehr Kontextinformationen du angibst, desto besser werden die Vorschläge.
        Vielleicht hilft es dir auch einfach, für dich selbst noch ein paar Gedanken zu sortieren.
      </p>
      <p>
        <strong>Tipp:</strong> Schreibe aus Ich- oder Wir-Perspektive und es wird so auch in den generierten Inhalten übernommen.
      </p>
    </div>
    <UForm class="flex flex-col gap-4 p-6" @submit="update" :state="state" :schema="formSchema">
      <UFormField label="Wer sind deine typischen Kunden?" name="aboutTargetGroup" help="Beschreibe deine Zielgruppe. Wen möchtest du ansprechen?">
        <UTextarea class="w-full" size="xl" v-model="state.aboutTargetGroup" />
      </UFormField>

      <UFormField label="Dein Angebot in einem Satz" name="offerShortDescription" help="Kurz und knapp, was machst du?">
        <UInput class="w-full" size="xl" v-model="state.offerShortDescription" />
      </UFormField>

      <UFormField label="Dein Angebot im Detail" name="offerDetails" help="Gehe hier genauer auf dein Angebot und spezielle Produkte bzw. Dienstleistungen ein. Gerne auch mit Preisen. Gibt es etwas, das du ganz besonders hervorheben möchtest?">
        <UTextarea
          class="w-full"
          size="xl"
          v-model="state.offerDetails"
          :rows="3"
          :max-rows="5"
          :min-rows="1"
          :autosize="{ minRows: 1, maxRows: 5 }"
        />
      </UFormField>

      <UFormField label="Werte und Philosophie" name="companyValues" help="Was ist dir wichtig? Was treibt dich an?">
        <UTextarea class="w-full" size="xl" v-model="state.companyValues" />
      </UFormField>

      <UFormField label="Kommunikationsstil" name="communicationTone" help="Per du? Per Sie? Locker oder förmlich?">
        <UTextarea class="w-full" size="xl" v-model="state.communicationTone" />
      </UFormField>

      <UFormField label="Dateien und Bilder" name="files" help="Lade Bilder von dir, deinem Unternehmen, deinen Produkten oder Dienstleistung hoch.">
        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="size-24 mb-4 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Hier klicken</span> oder Dateien hierhin ziehen</p>
              <p class="text-xs text-gray-500">PDF, JPG, PNG, GIF oder SVG (Max. 5 MB)</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" capture multiple ref="fileInput" />
          </label>
        </div>
      </UFormField>

      <div class="flex items-center justify-end gap-4 p-6">
        <UCheckbox
          label="Neue Website erstellen"
          v-model="generateWebsite"
        />

        <UCheckbox
          label="Neue Visitenkarte erstellen"
          v-model="generateVcard"
        />

        <UButton type="submit" size="xl" icon="i-heroicons-check" :loading="isUpdating">
          Speichern
        </UButton>
      </div>
    </UForm>
  </div>
</template>