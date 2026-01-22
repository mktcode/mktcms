import { ref } from 'vue'

export function useForm(endpoint: string, successMessageText: string, errorMessageText: string) {
  const isSending = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  async function sendForm(body: Record<string, any>) {
    if (isSending.value) return
    isSending.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
      await $fetch(endpoint, {
        method: 'POST',
        body,
      })

      successMessage.value = successMessageText
    }
    catch {
      errorMessage.value = errorMessageText
    }
    finally {
      isSending.value = false
    }
  }

  return {
    isSending,
    successMessage,
    errorMessage,
    sendForm,
  }
}
