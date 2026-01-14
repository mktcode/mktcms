<script setup lang="ts">
const isSending = ref(false);
const sendingError = ref<string | null>(null);
const sendingSuccess = ref(false);

async function sendMessage() {
  isSending.value = true;
  sendingError.value = null;
  sendingSuccess.value = false;

  try {
    await $fetch('/api/send-message', {
      method: 'POST',
      body: {
        subject: 'Test Subject',
        fields: {
          message: 'This is a test message.',
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

  <input type="text" placeholder="Subject" />
  <textarea placeholder="Your message"></textarea>
  <button
    @click="sendMessage"
    :disabled="isSending"
  >
    Send
  </button>
</template>
