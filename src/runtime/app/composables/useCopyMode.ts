import { computed, ref } from 'vue'
import { useRoute } from '#app'
import { isMarkdownPath, toFileExtension } from '../../shared/contentFiles'

function hasInvalidFilenameCharacters(filename: string) {
  return /[:\\/]/.test(filename) || /[\u0000-\u001F\u007F]/.test(filename)
}

export default function useCopyMode(sourcePath: string) {
  const route = useRoute()

  const isCopyMode = computed(() => {
    const value = route.query.copy

    if (Array.isArray(value)) {
      return value.includes('1') || value.includes('true')
    }

    return value === '1' || value === 'true'
  })

  const sourceParts = sourcePath.split(':').filter(part => part.trim() !== '')
  const sourceFilename = sourceParts.at(-1) || ''
  const sourceBaseName = sourceFilename.replace(/\.[^/.]+$/, '')
  const sourceExtension = toFileExtension(sourceFilename)
  const targetDirectory = sourceParts.slice(0, -1).join(':')

  const newFilename = ref(sourceBaseName)

  const trimmedFilename = computed(() => newFilename.value.trim())
  const targetFilename = computed(() => `${trimmedFilename.value}${sourceExtension}`)
  const targetPath = computed(() => targetDirectory ? `${targetDirectory}:${targetFilename.value}` : targetFilename.value)
  const targetEditPath = computed(() => {
    const editorType = isMarkdownPath(targetPath.value) ? 'markdown' : 'file'
    return `/admin/edit/${editorType}/${targetPath.value}`
  })

  const filenameError = computed(() => {
    if (!isCopyMode.value) return ''

    if (!trimmedFilename.value) {
      return 'Bitte einen Dateinamen eingeben.'
    }

    if (hasInvalidFilenameCharacters(trimmedFilename.value)) {
      return 'Der Dateiname enthält ungültige Zeichen.'
    }

    if (trimmedFilename.value === sourceBaseName) {
      return 'Bitte einen neuen Dateinamen eingeben.'
    }

    return ''
  })

  async function confirmOverwriteIfNeeded() {
    if (!isCopyMode.value || filenameError.value) {
      return false
    }

    const response = await $fetch<{ files: string[], dirs: string[] }>('/api/admin/list', {
      query: {
        path: targetDirectory,
      },
    })

    if (!response.files.includes(targetFilename.value)) {
      return true
    }

    if (import.meta.server) {
      return false
    }

    return window.confirm(`Die Datei "${targetFilename.value}" existiert bereits. Möchtest du sie überschreiben?`)
  }

  return {
    isCopyMode,
    newFilename,
    sourceExtension,
    targetPath,
    targetEditPath,
    filenameError,
    confirmOverwriteIfNeeded,
  }
}
