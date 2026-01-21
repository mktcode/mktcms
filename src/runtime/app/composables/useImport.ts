import { ref } from 'vue'

export default function useImport() {
  const uploadError = ref<string | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const isUploading = ref(false)

  async function uploadFile(event: Event) {
    if (isUploading.value) return
    isUploading.value = true

    uploadError.value = null

    const input = event.target as HTMLInputElement
    if (!input.files) {
      return
    }

    const file = input.files[0]
    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      await $fetch<{ success: boolean, path: string }>('/api/admin/import', {
        method: 'POST',
        body: formData,
      })
    }
    catch (error: any) {
      uploadError.value = error.data?.statusMessage || 'Fehler beim Hochladen der Datei'
      input.value = ''
    }

    isUploading.value = false
  }

  return {
    uploadError,
    isUploading,
    fileInput,
    uploadFile,
  }
}
