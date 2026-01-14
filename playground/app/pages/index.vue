<script setup lang="ts">
const { data: home } = await useFetch<string>('/api/content/home.md')
const { data: csv } = await useFetch<{ title: string, description: string, price: string, quantity: string }[]>('/api/content/test.csv')

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

  <div>
    <h2>Home.md Content</h2>
    <div v-html="home" />
  </div>

  <div>
    <h2>Test.csv Content</h2>
    <div v-for="row in csv" :key="row.title" style="margin-bottom: 10px;">
      <strong>{{ row.title }}</strong><br>
      Description: {{ row.description }}<br>
      Price: {{ row.price }}<br>
      Quantity: {{ row.quantity }}<br>
    </div>
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
