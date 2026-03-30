<script setup lang="ts">
import { ref } from 'vue'
import Admin from '../../components/admin.vue'
import { navigateTo, useRuntimeConfig } from '#app'
import { useLocalStorage } from '@vueuse/core'

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()

const adminAuthKey = ref('')
const adminAuthKeyFileInput = ref<HTMLInputElement | null>(null)
const wasHere = useLocalStorage('mktcms_admin_was_here', false)
const loginError = ref<string | null>(null)

function openAdminAuthKeyFilePicker() {
  adminAuthKeyFileInput.value?.click()
}

async function onAdminAuthKeyFileSelected(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]

  if (!file) {
    return
  }

  const isTxt = file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain'
  if (!isTxt) {
    if (input)
      input.value = ''
    return
  }

  const content = await file.text()
  adminAuthKey.value = content.replace(/^\uFEFF/, '').trim() // Remove BOM (Byte Order Mark) if present

  if (input)
    input.value = ''
}

async function login() {
  loginError.value = null

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        adminAuthKey: adminAuthKey.value,
      },
    })

    wasHere.value = true
    await navigateTo('/admin')
  }
  catch (error: any) {
    const statusCode = Number(error?.statusCode || error?.response?.status || error?.data?.statusCode)

    if (statusCode === 429) {
      const retryAfterSeconds = Number(
        error?.data?.data?.retryAfterSeconds
        || error?.response?._data?.data?.retryAfterSeconds,
      )

      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        loginError.value = `Zu viele Anmeldeversuche. Bitte warte ${retryAfterSeconds} Sekunden und versuche es dann erneut.`
        return
      }

      loginError.value = 'Zu viele Anmeldeversuche. Bitte warte einen Moment und versuche es dann erneut.'
      return
    }

    loginError.value = 'Anmeldung fehlgeschlagen. Der eingegebene Schlüssel ist ungültig.'
  }
}
</script>

<template>
  <Admin>
    <div class="p-6 md:p-8 w-full max-w-3xl mx-auto md:my-8 flex flex-col bg-ds-surface-container-lowest rounded-2xl shadow-ambient">
      <h1>
        Anmelden
      </h1>
      <h2 style="color: var(--color-ds-on-surface-variant);">
        Administration: {{ siteUrl.replace(/https?:\/\//, '') }}
      </h2>
      <div class="mt-6">
        <label
          for="adminAuthKey"
          class="text-sm font-medium"
          style="color: var(--color-ds-on-surface);"
        >
          Schlüssel:
        </label>
        <div class="flex gap-2 mt-2">
          <input
            id="adminAuthKey"
            v-model="adminAuthKey"
            type="password"
            class="flex-1"
            autocomplete="one-time-code"
            @keyup.enter="login"
          >
          <input
            ref="adminAuthKeyFileInput"
            type="file"
            accept=".txt,text/plain"
            class="hidden"
            @change="onAdminAuthKeyFileSelected"
          >
          <button
            type="button"
            class="button secondary"
            @click="openAdminAuthKeyFilePicker"
          >
            Datei wählen
          </button>
        </div>
        <button
          type="button"
          class="button w-full justify-center mt-2.5"
          @click="login"
        >
          Anmelden
        </button>

        <div
          v-if="loginError"
          class="mt-3 flex gap-3 items-center px-4 py-3 rounded-2xl text-sm bg-ds-error-container text-ds-error"
          role="alert"
          aria-live="polite"
        >
          {{ loginError }}
        </div>
      </div>
    </div>
  </Admin>
</template>
