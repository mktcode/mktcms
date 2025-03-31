<script setup lang="ts">
type State = {
  needsPrivacyOfficer: boolean
  privacyOfficerName: string
  privacyOfficerEmail: string
  privacyOfficerPhone: string
  usesOtherServiceProviders: boolean
  otherServiceProviders: {
    name: string
    purpose: string
    dataTypes: string
    linkToPrivacyPolicy: string
    dataProcessingAgreement: boolean
  }[]
  usesSocialMedia: boolean
  socialMedia: {
    name: string
  }[]
}

const state = reactive<State>({
  needsPrivacyOfficer: false,
  privacyOfficerName: '',
  privacyOfficerEmail: '',
  privacyOfficerPhone: '',
  usesOtherServiceProviders: false,
  otherServiceProviders: [{
    name: '',
    purpose: '',
    dataTypes: '',
    linkToPrivacyPolicy: '',
    dataProcessingAgreement: false,
  }],
  usesSocialMedia: false,
  socialMedia: [{
    name: '',
  }],
})

const formSections = [
  {
    label: 'Datenschutzbeauftragter',
    icon: 'i-heroicons-user',
    slot: 'dpo',
  },
  {
    label: 'Weitere Dienstleister',
    icon: 'i-heroicons-building-office',
    slot: 'service-providers',
  },
  {
    label: 'Social Media',
    icon: 'i-heroicons-share',
    slot: 'social-media',
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
          v-model="state.needsPrivacyOfficer"
        />
    
        <template v-if="state.needsPrivacyOfficer">
          <p>
            Ein Name ist nicht zwingend erforderlich, sondern nur eine Kontaktmöglichkeit.
            Ist diese allerdings nur durch Nennung des Namens gegeben, so ist der Name anzugeben.
            Der Datenschutzbeauftragte muss außerdem Ihrer zuständigen Aufsichtsbehörde gemeldet werden.
            Eine Liste der Aufsichtsbehörden finden Sie <a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html" target="_blank" class="text-sky-500">hier</a>.
          </p>
          <UFormField label="Name" name="privacyOfficerName">
            <UInput class="w-full" size="xl" v-model="state.privacyOfficerName" />
          </UFormField>
          <UFormField label="E-Mail" name="privacyOfficerEmail">
            <UInput class="w-full" size="xl" v-model="state.privacyOfficerEmail" />
          </UFormField>
          <UFormField label="Telefon" name="privacyOfficerPhone">
            <UInput class="w-full" size="xl" v-model="state.privacyOfficerPhone" />
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
            <UFormField label="Verarbeitete Datenarten" name="dataTypes">
              <UInput class="w-full" size="xl" v-model="provider.dataTypes" />
            </UFormField>
            <UFormField label="Zweck der Verarbeitung" name="purpose">
              <UInput class="w-full" size="xl" v-model="provider.purpose" />
            </UFormField>
            <UFormField label="Link zur Datenschutzerklärung des Dienstleisters" name="linkToPrivacyPolicy">
              <UInput class="w-full" size="xl" v-model="provider.linkToPrivacyPolicy" />
            </UFormField>
            <USwitch
              unchecked-icon="i-lucide-x"
              checked-icon="i-lucide-check"
              default-value
              label="Datenverarbeitungsvertrag vorhanden?"
              v-model="provider.dataProcessingAgreement"
            />
          </div>
          <UButton icon="i-heroicons-plus" size="xl" @click="state.otherServiceProviders.push({ name: '', purpose: '', dataTypes: '', linkToPrivacyPolicy: '', dataProcessingAgreement: false })">
            Dienstleister hinzufügen
          </UButton>
        </template>
      </template>

      <template #social-media-body>
        <p class="text-lg font-bold">
          Nutzen Sie Social Media Plattformen, wie Facebook, Instagram, TikTok, etc., für Ihre gewerblichen Zwecke?
        </p>
        <USwitch
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          default-value
          label="Ja, ich nutze Social Media Plattformen."
          v-model="state.usesSocialMedia"
        />
        <template v-if="state.usesSocialMedia">
          <div v-for="(social, index) in state.socialMedia" :key="index" class="flex flex-col gap-4">
            <UFormField label="Name" name="name">
              <UInput class="w-full" size="xl" v-model="social.name" />
            </UFormField>
          </div>
          <UButton icon="i-heroicons-plus" size="xl" @click="state.socialMedia.push({ name: '' })">
            Social Media Plattform hinzufügen
          </UButton>
          <p>
            Bitte bedenken Sie, dass Sie Ihre Datenschutzerklärung und Ihr Impressum auch in Ihren Social Media Profilen verlinken müssen.
          </p>
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