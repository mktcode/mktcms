<script setup lang="ts">
import type { z } from 'zod';
import { privacyFormSchema } from '~/types';

type FormSchema = z.infer<typeof privacyFormSchema>;

const state = reactive<FormSchema>({
  needsOfficer: false,
  officerName: '',
  officerEmail: '',
  officerPhone: '',
  usesOfflineData: false,
  offlineDataText: '',
  usesOtherServiceProviders: false,
  otherServiceProviders: [{
    name: '',
    purpose: '',
    dataTypes: '',
    linkToPrivacyPolicy: '',
  }],
})

const formSections = [
  {
    label: 'Datenschutzbeauftragter',
    icon: 'i-heroicons-user',
    slot: 'dpo',
  },
  {
    label: 'Analoge Daten',
    icon: 'i-heroicons-printer',
    slot: 'offline-data',
  },
  {
    label: 'Weitere Dienstleister',
    icon: 'i-heroicons-building-office',
    slot: 'service-providers',
  },
]
</script>

<template>
  <div>
    <p class="p-6">
      Wenn Sie über Solihost eine Website betreiben, werden auf Basis der von Ihnen genutzten Funktionen automatisch auch eine Datenschutzerklärung und ein Impressum erstellt.
      Datenschutzrelevante Angaben, die über Solihost hinausgehen, können Sie hier ergänzen.
    </p>
    <UAccordion
      :items="formSections"
      :ui="{ header: 'px-4 hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[state=open]:text-sky-500', body: 'p-6 flex flex-col gap-4' }"
      class="border-t border-b border-gray-200"
    >
      <template #dpo-body>
        <p class="text-lg font-bold">
          Einen Datenschutzbeauftragten müssen Sie ernennen, wenn eines der beiden folgenden Kriterien zutrifft:
        </p>
        <ul class="list-disc pl-6">
          <li>Sie beschäftigen mindestens 20 Mitarbeiter regelmäßig mit der Verarbeitung personenbezogener Daten.</li>
          <li>Es ist Ihr Kerngeschäft besonders sensible Daten zu Verarbeiten und zu Übermitteln (z.B. Gesundheitsdaten, Religion, sexuelle Orientierung, Verhaltensprofile, etc.)</li>
        </ul>
        <USwitch
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          default-value
          label="Ja, ich muss einen Datenschutzbeauftragten ernennen."
          v-model="state.needsOfficer"
        />
    
        <template v-if="state.needsOfficer">
          <p>
            Ein Name ist nicht zwingend erforderlich, sondern nur eine Kontaktmöglichkeit.
            Ist diese allerdings nur durch Nennung des Namens gegeben, so ist der Name anzugeben.
            Der Datenschutzbeauftragte muss außerdem Ihrer zuständigen Aufsichtsbehörde gemeldet werden.
            Eine Liste der Aufsichtsbehörden finden Sie <a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html" target="_blank" class="text-sky-500">hier</a>.
          </p>
          <UFormField label="Name" name="privacyOfficerName">
            <UInput class="w-full" size="xl" v-model="state.officerName" />
          </UFormField>
          <UFormField label="E-Mail" name="privacyOfficerEmail">
            <UInput class="w-full" size="xl" v-model="state.officerEmail" />
          </UFormField>
          <UFormField label="Telefon" name="privacyOfficerPhone">
            <UInput class="w-full" size="xl" v-model="state.officerPhone" />
          </UFormField>
        </template>
      </template>

      <template #offline-data-body>
        <p class="text-lg font-bold">
          Erheben Sie personenbezogene Daten Ihrer Kunden auch analog, z.B. in Papierform?
        </p>
        <USwitch
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          default-value
          label="Ja, ich erhebe personenbezogene Daten auch analog."
          v-model="state.usesOfflineData"
        />
    
        <template v-if="state.usesOfflineData">
          <p>
            Bitte beschreiben Sie hier, wie Sie personenbezogene Daten analog erheben.
          </p>
          <UFormField label="Beschreibung" name="offlineDataText">
            <UInput class="w-full" size="xl" v-model="state.offlineDataText" />
          </UFormField>
        </template>
      </template>

      <template #service-providers-body>
        <p class="text-lg font-bold">
          Nutzen Sie außer Solihost noch weitere Dienstleister, die personenbezogene Daten Ihrer Kunden verarbeiten?
        </p>
    
        <USwitch
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          default-value
          label="Ja, ich nutze weitere Dienstleister."
          v-model="state.usesOtherServiceProviders"
        />
    
        <template v-if="state.usesOtherServiceProviders">
          <div v-for="(provider, index) in state.otherServiceProviders" :key="index" class="flex flex-col gap-4">
            <UFormField label="Name" name="name">
              <UInput class="w-full" size="xl" v-model="provider.name" />
            </UFormField>
            <UFormField label="Verarbeitete Daten" name="dataTypes" help="Geben Sie einfach mit Komma getrennt an, welche Daten weitergegeben werden. z.B. Name, E-Mail, Adresse, Geburtsdatum">
              <UInput class="w-full" size="xl" v-model="provider.dataTypes" />
            </UFormField>
            <UFormField label="Zweck der Verarbeitung" name="purpose" help="Beschreiben Sie kurz, zu welchem Zweck die Daten verarbeitet werden.">
              <UInput class="w-full" size="xl" v-model="provider.purpose" />
            </UFormField>
            <UFormField label="Link zur Datenschutzerklärung des Dienstleisters" name="linkToPrivacyPolicy">
              <UInput class="w-full" size="xl" v-model="provider.linkToPrivacyPolicy" />
            </UFormField>
          </div>
          <UButton icon="i-heroicons-plus" size="xl" @click="state.otherServiceProviders.push({ name: '', purpose: '', dataTypes: '', linkToPrivacyPolicy: '' })">
            Dienstleister hinzufügen
          </UButton>
        </template>
      </template>
    </UAccordion>

    <div class="flex justify-end p-6">
      <UButton type="submit" size="xl" icon="i-heroicons-check">
        Speichern
      </UButton>
    </div>
  </div>
</template>