import { createError } from 'h3'

export function toNodeBuffer(raw: unknown): Buffer {
  if (Buffer.isBuffer(raw)) {
    return raw
  }

  if (typeof raw === 'string') {
    return Buffer.from(raw)
  }

  if (raw instanceof ArrayBuffer) {
    return Buffer.from(raw)
  }

  if (ArrayBuffer.isView(raw)) {
    return Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength)
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Invalid binary file',
  })
}
