<script setup lang="ts">
  const authKey = ref('');
  
  async function login() {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        authKey: authKey.value,
      },
    });
  
    await navigateTo('/admin');
  }
  </script>
  
  <template>
    <div>
      <h1>Admin Login</h1>
      <div>
        <label for="authKey">Authentication Key:</label>
        <input type="password" id="authKey" v-model="authKey" />
      </div>
      <div>
        <button @click="login">Anmelden</button>
      </div>
    </div>
  </template>