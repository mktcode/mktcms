<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { companyFormSchema } from '~/types'

const { user } = useUserSession()
const { public: { s3Endpoint } } = useRuntimeConfig()

const redirectToGuthaben = useLocalStorage('redirectToGuthaben', true)

const toast = useToast()
const isUpdating = ref(false)

const state = reactive({
  logo: '',
  name: '',
  street: '',
  zip: '',
  city: '',
  phone: '',
  email: '',
  vat: '',
  isSmallBusiness: true,
  bankHolder: '',
  bankIban: '',
  bankBic: '',
})

async function load() {
  const existingCompany = await $fetch('/api/company')
  if (existingCompany) {
    state.logo = existingCompany.logo || ''
    state.name = existingCompany.name
    state.street = existingCompany.street
    state.zip = existingCompany.zip
    state.city = existingCompany.city
    state.phone = existingCompany.phone || ''
    state.email = existingCompany.email || ''
    state.vat = existingCompany.vat || ''
    state.isSmallBusiness = !!existingCompany.isSmallBusiness
    state.bankHolder = existingCompany.bankHolder || ''
    state.bankIban = existingCompany.bankIban || ''
    state.bankBic = existingCompany.bankBic || ''
  }

  if (state.email === '') {
    state.email = user.value?.email || ''
  }
}

function selectLogo(key: string) {
  state.logo = key
}

async function update() {
  isUpdating.value = true
  await $fetch('/api/company/upsert', {
    method: 'POST',
    body: {
      logo: state.logo,
      name: state.name,
      street: state.street,
      zip: state.zip,
      city: state.city,
      phone: state.phone,
      email: state.email,
      vat: state.vat,
      isSmallBusiness: state.isSmallBusiness,
      bankHolder: state.bankHolder,
      bankIban: state.bankIban,
      bankBic: state.bankBic,
    },
  })
  isUpdating.value = false
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Ihre Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })

  if (redirectToGuthaben.value) {
    redirectToGuthaben.value = false
    navigateTo('/einstellungen/guthaben')
  }
}

onMounted(load)

const formSections = [
  {
    label: 'Kontaktdaten',
    icon: 'i-heroicons-building-storefront',
    slot: 'general',
  },
  {
    label: 'Inhalte planen',
    icon: 'i-heroicons-sparkles',
    slot: 'content',
  },
  {
    label: 'Buchhaltung',
    icon: 'i-heroicons-scale',
    slot: 'bank',
  },
  {
    label: 'Datenschutzerklärung',
    icon: 'i-heroicons-shield-check',
    slot: 'privacy',
  },
]
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarSettings />
    </template>
    <div class="p-6">
      <ClientOnly>
        <LayoutDismissableAlert title="Herzlich Willkommen!" storage-key="showWelcomeMessage.firma">
          <p>
            Geben Sie zunächst Ihre Firmendaten ein. Diese werden dann an anderer Stelle automatisch eingefügt (Website, Visitenkarten, Buchhaltung, etc.). Danach können Sie dann Ihre Website einrichten, eine Domain registrieren und E-Mail-Adressen anlegen oder sich erstmal um die Buchhaltung kümmern. Klicken Sie oben rechts auf Hilfe, wenn Sie mal nicht weiterkommen.
          </p>
        </LayoutDismissableAlert>
      </ClientOnly>
    </div>

    <UAccordion
      :items="formSections"
      :ui="{ label: 'text-xl', header: 'px-6 hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[state=open]:text-sky-500' }"
      class="border-t border-b border-gray-200"
    >
      <template #general-body>
        <UForm class="flex flex-col gap-4 p-6" @submit="update" :state="state" :schema="companyFormSchema">
          <div class="flex flex-col items-start gap-4">
            <img v-if="state.logo" :src="`${s3Endpoint}/mktcms/${state.logo}`" alt="Kein Bild" class="w-40 object-cover object-center rounded-lg" />
            <div class="flex items-start gap-4">
              <LayoutFileExplorer @select="selectLogo" buttonLabel="Logo auswählen" />
              <UButton
                v-if="state.logo"
                label="Logo entfernen"
                variant="ghost"
                icon="i-heroicons-trash"
                @click="state.logo = ''"
              />
            </div>
          </div>

          <UFormField label="Firmenname" name="companyName" required>
            <UInput class="w-full" size="xl" v-model="state.name" />
          </UFormField>

          <UFormField label="Straße" name="street" required>
            <UInput class="w-full" size="xl" v-model="state.street" />
          </UFormField>

          <div class="flex w-full gap-4">
            <div>
              <UFormField label="PLZ" name="zip" required>
                <UInput class="w-full" size="xl" v-model="state.zip" />
              </UFormField>
            </div>
            <div class="flex-grow">
              <UFormField label="Ort" name="city" required>
                <UInput class="w-full" size="xl" v-model="state.city" />
              </UFormField>
            </div>
          </div>

          <UFormField label="Telefon" name="phone" required>
            <UInput class="w-full" size="xl" v-model="state.phone" />
          </UFormField>

          <UFormField label="E-Mail" name="email">
            <UInput class="w-full" size="xl" v-model="state.email" />
          </UFormField>

          <UCheckbox
            label="Ich bin Kleinunternehmer"
            description="Als Kleinunternehmer sind Sie von der Umsatzsteuer befreit. Sie können diese Einstellung später ändern."
            name="isSmallBusiness"
            v-model="state.isSmallBusiness"
          />

          <Transition name="fade">
            <UFormField label="Umsatzsteuer-ID" name="vatId" v-if="!state.isSmallBusiness">
              <UInput class="w-full" size="xl" v-model="state.vat" />
            </UFormField>
          </Transition>

          <div class="flex justify-end">
            <UButton type="submit" size="xl" icon="i-heroicons-check">
              Speichern
            </UButton>
          </div>
        </UForm>
      </template>

      <template #content-body>
        <SettingsPrepareContentForm />
      </template>

      <template #bank-body>
        <UForm class="flex flex-col gap-4 p-6" @submit="update" :state="state" :schema="companyFormSchema">
          <UFormField label="Kontoinhaber" name="bankHolder">
            <UInput class="w-full" size="xl" v-model="state.bankHolder" />
          </UFormField>

          <UFormField label="IBAN" name="bankIban">
            <UInput class="w-full" size="xl" v-model="state.bankIban" />
          </UFormField>

          <UFormField label="BIC" name="bankBic">
            <UInput class="w-full" size="xl" v-model="state.bankBic" />
          </UFormField>

          <div class="flex justify-end">
            <UButton type="submit" size="xl" icon="i-heroicons-check">
              Speichern
            </UButton>
          </div>
        </UForm>
      </template>

      <template #privacy-body>
        <SettingsPrivacyForm />
      </template>
    </UAccordion>
  </NuxtLayout>
</template>