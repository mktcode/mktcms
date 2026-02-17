import { navigateTo } from '#imports'
import { computed, ref } from 'vue'
import useFileType from './useFileType'

export default function useAdminUpload() {
  const uploadError = ref<string | null>(null)
  const files = ref<string[]>([])
  const fileInput = ref<HTMLInputElement | null>(null)
  const fileInputImg = ref<HTMLInputElement | null>(null)
  const fileInputPdf = ref<HTMLInputElement | null>(null)
  const isUploading = ref(false)
  const path = ref<string | null>(null)
  const sanePath = computed(() => {
    return path.value ? path.value.replace(/^\//, '').replace(/\/$/, '') : undefined
  })

  async function uploadFiles(event: Event) {
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
      const res = await $fetch<{ success: boolean, path: string }>('/api/admin/upload', {
        method: 'POST',
        body: formData,
        query: { path: sanePath.value },
      })
      if (res?.success && res.path) {
        files.value.push(res.path)
        const { isMarkdown } = useFileType(res.path)
        await navigateTo(`/admin/edit/${isMarkdown ? 'markdown/' : 'file/'}${res.path}`)
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
    path,
    files,
    fileInput,
    fileInputImg,
    fileInputPdf,
    uploadFiles,
  }
}
