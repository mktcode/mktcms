export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const
export const PDF_EXTENSIONS = ['.pdf'] as const
export const TEXT_EXTENSIONS = ['.txt', '.json'] as const
export const EDITABLE_EXTENSIONS = ['.md', '.csv', '.txt', '.json'] as const
export const CONTENT_UPLOAD_EXTENSIONS = ['.pdf', ...IMAGE_EXTENSIONS, '.md', '.docx', '.txt', '.csv', '.json'] as const

export const DEFAULT_MAX_UPLOAD_BYTES = 50 * 1024 * 1024

export function toFileExtension(filePath: string) {
  const dotIndex = filePath.lastIndexOf('.')
  if (dotIndex < 0) {
    return ''
  }

  return filePath.slice(dotIndex).toLowerCase()
}

export function hasAllowedExtension(filePath: string, allowedExtensions: readonly string[]) {
  const extension = toFileExtension(filePath)
  return extension !== '' && allowedExtensions.includes(extension)
}

export function isImagePath(filePath: string) {
  return hasAllowedExtension(filePath, IMAGE_EXTENSIONS)
}

export function isPdfPath(filePath: string) {
  return hasAllowedExtension(filePath, PDF_EXTENSIONS)
}

export function isTextPath(filePath: string) {
  return hasAllowedExtension(filePath, TEXT_EXTENSIONS)
}

export function isMarkdownPath(filePath: string) {
  return hasAllowedExtension(filePath, ['.md'])
}

export function isCsvPath(filePath: string) {
  return hasAllowedExtension(filePath, ['.csv'])
}

export function isJsonPath(filePath: string) {
  return hasAllowedExtension(filePath, ['.json'])
}

export function toAcceptAttribute(extensions: readonly string[]) {
  return extensions.join(',')
}
