<script setup lang="ts">
import { ref } from 'vue'
import Admin from '../../components/admin.vue'
import { navigateTo } from '#app'

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
    <h1>Admin Login</h1>
    <div>
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
        class="button mt-2.5"
        @click="login"
      >
        Anmelden
      </button>
    </div>
  </Admin>
</template>
