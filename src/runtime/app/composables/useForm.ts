import { z } from 'zod'
import { ref } from 'vue'

export function useForm(
  endpoint: string,
  successMessageText: string,
  errorMessageText: string,
  validationSchema: z.ZodObject<any>,
) {
  const isSending = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')
  const validationErrors = ref<Record<string, string[] | undefined>>({})
  const fieldsTouched = ref<Record<string, boolean>>({})

  function validate(body: Record<string, any>) {
    const parseResult = validationSchema.safeParse(body)

    if (parseResult.success) {
      validationErrors.value = {}
      return true
    }
    else {
      validationErrors.value = z.flattenError(parseResult.error).fieldErrors
      return false
    }
  }

  function validationErrorsFor(field: string) {
    if (!fieldsTouched.value[field]) return []

    return validationErrors.value[field] || []
  }

  async function send(body: Record<string, any>) {
    if (isSending.value) return

    successMessage.value = ''
    errorMessage.value = ''

    validate(body)

    if (validationErrors.value) return

    isSending.value = true

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

    isSending.value = false
  }

  return {
    isSending,
    successMessage,
    errorMessage,
    validationErrors,
    fieldsTouched,
    validationErrorsFor,
    validate,
    send,
  }
}
