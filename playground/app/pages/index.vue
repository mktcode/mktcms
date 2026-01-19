<script setup lang="ts">
const { data: md } = await useFetch<string>('/api/content/default.md')
const { data: csv } = await useFetch<{ Title: string, Description: string }[]>('/api/content/default.csv')
const { data: txt } = await useFetch<string>('/api/content/default.txt')
const { data: margherita } = await useFetch<{ name: string, description: string, price: number, ingredients: string[], vegetarian: boolean, image: string }>('/api/content/products:food:margherita.json')

const isSending = ref(false)
const sendingError = ref<string | null>(null)
const sendingSuccess = ref(false)

const subject = ref('')
const message = ref('')

async function sendMessage() {
  isSending.value = true
  sendingError.value = null
  sendingSuccess.value = false

  try {
    await $fetch('/api/send-message', {
      method: 'POST',
      body: {
        subject: subject.value,
        fields: {
          message: message.value,
        },
      },
    })
    sendingSuccess.value = true
  }
  catch {
    sendingError.value = 'Failed to send message.'
  }
  finally {
    isSending.value = false
  }
}
</script>

<template>
  <h1>Welcome to MKT CMS</h1>

  <h2>Margherita</h2>
  <div v-if="margherita">
    <strong>{{ margherita.name }}</strong><br>
    {{ margherita.description }}<br>
    Price: {{ margherita.price }} EUR<br>
    Ingredients: {{ margherita.ingredients.join(', ') }}<br>
    Vegetarian: {{ margherita.vegetarian ? 'Yes' : 'No' }}<br>
  </div>

  <img
    src="http://localhost:3000/api/content/default.jpg"
    alt="Default Image"
    style="max-width: 300px;"
  >

  <div>
    <h2>Markdown Content</h2>
    <div v-html="md" />
  </div>

  <div>
    <h2>CSV Content</h2>
    <div
      v-for="row in csv"
      :key="row.Title"
      style="margin-bottom: 10px;"
    >
      <strong>{{ row.Title }}</strong><br>
      Description: {{ row.Description }}<br>
    </div>
  </div>

  <div>
    <h2>Text Content</h2>
    <pre>{{ txt }}</pre>
  </div>

  <input
    v-model="subject"
    type="text"
    placeholder="Subject"
  >
  <textarea
    v-model="message"
    placeholder="Your message"
  />
  <button
    :disabled="isSending"
    @click="sendMessage"
  >
    Send
  </button>
</template>
