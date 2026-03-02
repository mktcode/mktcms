import { createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { DEFAULT_MAX_UPLOAD_BYTES } from '../../shared/contentFiles'

export function getMaxUploadBytes() {
  const { mktcms: { uploadMaxBytes } } = useRuntimeConfig()
  const parsed = Number(uploadMaxBytes)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_UPLOAD_BYTES
  }

  return Math.floor(parsed)
}

export function assertUploadSize(fileData: Buffer | Uint8Array | string, maxBytes: number) {
  const byteLength = typeof fileData === 'string' ? Buffer.byteLength(fileData) : fileData.byteLength

  if (byteLength > maxBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: `Upload too large. Maximum allowed size is ${maxBytes} bytes.`,
    })
  }
}
