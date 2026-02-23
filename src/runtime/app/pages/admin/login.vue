<script setup lang="ts">
import { ref } from 'vue'
import Admin from '../../components/admin.vue'
import { navigateTo, useRuntimeConfig } from '#app'
import { useLocalStorage } from '@vueuse/core'

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()

const adminAuthKey = ref('')
const adminAuthKeyFileInput = ref<HTMLInputElement | null>(null)
const wasHere = useLocalStorage('mktcms_admin_was_here', false)

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
  await $fetch('/api/admin/login', {
    method: 'POST',
    body: {
      adminAuthKey: adminAuthKey.value,
    },
  })

  wasHere.value = true
  await navigateTo('/admin')
}
</script>

<template>
  <Admin>
    <div class="boxed">
      <h1 class="text-3xl font-bold">
        Anmelden
      </h1>
      <h2 class="text-gray-500">
        Administration: {{ siteUrl.replace(/https?:\/\//, '') }}
      </h2>
      <div class="mt-6">
        <label
          for="adminAuthKey"
          class="text-gray-700"
        >
          Schlüssel:
        </label>
        <div class="flex gap-2 mt-2">
          <input
            id="adminAuthKey"
            v-model="adminAuthKey"
            type="password"
            class="border border-gray-300 rounded-md p-2 flex-1"
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
      </div>
    </div>
  </Admin>
</template>
