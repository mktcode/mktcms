<script setup lang="ts">
import { companyFormSchema } from '~/types'

const { user } = useUserSession()

const showWelcomeMessage = ref(true)

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
  }

  if (state.email === '') {
    state.email = user.value?.email || ''
  }
}

async function update() {
  isUpdating.value = true
  await $fetch('/api/company/upsert', {
    method: 'POST',
    body: {
      name: state.name,
      street: state.street,
      zip: state.zip,
      city: state.city,
      phone: state.phone,
      email: state.email,
      vat: state.vat,
      isSmallBusiness: state.isSmallBusiness,
    },
  })
  isUpdating.value = false
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Ihre Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })
}

onMounted(load)
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarSettings />
    </template>
    <div class="p-6">
      <Transition name="fade">
        <UAlert
          v-if="showWelcomeMessage"
          variant="solid"
          color="primary"
          title="Willkommen in Mkt's CMS!"
          description="Geben Sie zunächst Ihre Firmendaten ein. Diese werden dann an anderer Stelle automatisch eingefügt (Website, Visitenkarten, etc.). Danach können Sie dann eine Domain registrieren, E-Mail-Adressen und Website einrichten oder sich erstmal um die Buchhaltung kümmern. Klicken Sie oben rechts auf Hilfe, wenn Sie mal nicht weiterkommen."
          icon="i-heroicons-information-circle"
          :ui="{ icon: 'size-11' }"
          :close="{ class: 'text-white/75 hover:text-white' }"
          @update:open="showWelcomeMessage = $event"
        />
      </Transition>

      <h1 class="text-3xl font-bold mb-4 mt-6">
        Firma
      </h1>
  
      <UForm class="flex flex-col gap-4" @submit="update" :state="state" :schema="companyFormSchema">
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
    </div>
  </NuxtLayout>
</template>