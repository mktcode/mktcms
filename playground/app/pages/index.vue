<script setup lang="ts">
const isSending = ref(false);
const sendingError = ref<string | null>(null);
const sendingSuccess = ref(false);

const subject = ref('');
const message = ref('');

async function sendMessage() {
  isSending.value = true;
  sendingError.value = null;
  sendingSuccess.value = false;

  try {
    await $fetch('/api/send-message', {
      method: 'POST',
      body: {
        subject: subject.value,
        fields: {
          message: message.value,
        },
      },
    });
    sendingSuccess.value = true;
  } catch (error) {
    sendingError.value = 'Failed to send message.';
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <h1>Welcome to MKT CMS</h1>

  <input type="text" placeholder="Subject" v-model="subject" />
  <textarea placeholder="Your message" v-model="message"></textarea>
  <button
    @click="sendMessage"
    :disabled="isSending"
  >
    Send
  </button>
</template>
