<script setup lang="ts">
import { smtpFormSchema } from '~/types'

const toast = useToast()
const isUpdating = ref(false)

const state = reactive({
  host: '',
  port: 587,
  username: '',
  password: '',
})

async function load() {
  const existingSmtp = await $fetch('/api/smtp')
  if (existingSmtp) {
    state.host = existingSmtp.host || ''
    state.port = existingSmtp.port || 587
    state.username = existingSmtp.username || ''
    state.password = existingSmtp.password || ''
  }
}


async function update() {
  isUpdating.value = true
  await $fetch('/api/smtp/upsert', {
    method: 'POST',
    body: {
      host: state.host,
      port: state.port,
      username: state.username,
      password: state.password,
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
      <ClientOnly>
        <LayoutDismissableAlert title="E-Mail Einstellungen" storage-key="showWelcomeMessage.email">
          <p>
            Solihost kann E-Mails an Ihre Kunden senden, z.B. Rechnungen. Dafür müssen Sie die SMTP-Einstellungen Ihres E-Mail-Postfachs angeben. Haben Sie Domain und E-Mail über Solihost eingerichtet, sind diese bereits korrekt ausgefüllt.
          </p>
        </LayoutDismissableAlert>
      </ClientOnly>
    </div>

    <UForm class="flex flex-col gap-4 p-6" @submit="update" :state="state" :schema="smtpFormSchema">
      <UFormField label="Host" name="host" required>
        <UInput class="w-full" size="xl" v-model="state.host" placeholder="z.B. smtp.beispiel.de" />
      </UFormField>

      <UFormField label="Port" name="port" required>
        <UInput class="w-full" size="xl" v-model="state.port" placeholder="z.B. 587" />
      </UFormField>

      <UFormField label="Benutzername" name="password" required>
        <UInput class="w-full" size="xl" v-model="state.username" placeholder="Benutzername" />
      </UFormField>

      <UFormField label="Passwort" name="password" required>
        <UInput class="w-full" size="xl" v-model="state.password" type="password" placeholder="Passwort" />
      </UFormField>

      <div class="flex justify-end">
        <UButton type="submit" size="xl" icon="i-heroicons-check">
          Speichern
        </UButton>
      </div>
    </UForm>
  </NuxtLayout>
</template>