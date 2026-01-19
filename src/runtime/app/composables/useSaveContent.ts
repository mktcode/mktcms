import { useFetch } from '#app'
import { ref, watch, type Ref } from 'vue'
import usePathParam from './usePathParam'

export default async function useSaveContent() {
  const { path } = usePathParam()

  const { data: content } = await useFetch<string>(`/api/admin/content/${path}`)

  if (content.value === undefined) {
    throw new Error(`Content not found for path: ${path}`)
  }

  const isSaving = ref(false)
  const savingSuccessful = ref(false)

  watch(content, () => {
    savingSuccessful.value = false
  })

  async function saveContent() {
    isSaving.value = true
    savingSuccessful.value = false

    await $fetch(`/api/admin/content/${path}`, {
      method: 'POST',
      body: { content: content.value },
    })

    isSaving.value = false
    savingSuccessful.value = true
  }

  return {
    content: content as Ref<string>,
    isSaving,
    savingSuccessful,
    saveContent,
  }
}
