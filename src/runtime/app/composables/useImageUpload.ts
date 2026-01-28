import { ref } from 'vue'

export default function useAdminUpload() {
  const uploadError = ref<string | null>(null)
  const files = ref<string[]>([])
  const fileInput = ref<HTMLInputElement | null>(null)
  const isUploading = ref(false)

  async function uploadFiles(event: Event, path: string) {
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
      const res = await $fetch<{ success: boolean, path: string }>('/api/admin/image', {
        method: 'POST',
        body: formData,
        query: { path },
      })
      if (res?.success && res.path) {
        files.value.push(res.path)
      }
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
    files,
    fileInput,
    uploadFiles,
  }
}
