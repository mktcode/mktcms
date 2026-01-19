<script setup lang="ts">
import { ref } from 'vue'
import Admin from '../../components/admin.vue'
import { navigateTo, useRuntimeConfig } from '#app'

const { public: { mktcms: { siteUrl } } } = useRuntimeConfig()

const adminAuthKey = ref('')

async function login() {
  await $fetch('/api/admin/login', {
    method: 'POST',
    body: {
      adminAuthKey: adminAuthKey.value,
    },
  })

  await navigateTo('/admin')
}
</script>

<template>
  <Admin>
    <div class="border border-gray-200 p-4 rounded-xl max-w-md mx-auto mt-20">
      <h1 class="text-3xl font-bold">
        Anmelden
      </h1>
      <h2 class="text-gray-500">
        Administration: {{ siteUrl.replace(/https?:\/\//, '') }}
      </h2>
      <div class="mt-6">
        <label
          for="authKey"
          class="text-gray-700"
        >
          Schlüssel:
        </label>
        <input
          id="adminAuthKey"
          v-model="adminAuthKey"
          type="password"
          class="border border-gray-300 rounded-md p-2 mt-2"
          @keyup.enter="login"
        >
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
