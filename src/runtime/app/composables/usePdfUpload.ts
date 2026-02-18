import { ref } from 'vue'

export default function usePdfUpload() {
  const uploadError = ref<string | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const isUploading = ref(false)

  async function uploadFiles(event: Event, path: string) {
    if (isUploading.value) return
    isUploading.value = true

    uploadError.value = null

    const input = event.target as HTMLInputElement
    if (!input.files) {
      isUploading.value = false
      return
    }

    const file = input.files[0]
    if (!file) {
      isUploading.value = false
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      await $fetch<{ success: boolean, path: string }>('/api/admin/pdf', {
        method: 'POST',
        body: formData,
        query: { path },
      })
    }
    catch (error: any) {
      uploadError.value = error.data?.statusMessage || 'Fehler beim Hochladen der PDF-Datei'
      input.value = ''
    }

    isUploading.value = false
  }

  return {
    uploadError,
    isUploading,
    fileInput,
    uploadFiles,
  }
}
