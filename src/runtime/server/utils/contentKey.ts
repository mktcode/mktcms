import { createError } from 'h3'

type NormalizeOptions = {
  allowEmpty?: boolean
}

function invalidContentKeyError() {
  return createError({
    statusCode: 400,
    statusMessage: 'Invalid content path',
  })
}

function hasControlCharacters(value: string) {
  for (const char of value) {
    const code = char.charCodeAt(0)
    if ((code >= 0 && code <= 31) || code === 127) {
      return true
    }
  }

  return false
}

function normalizeContentKeyInternal(input: string, options: NormalizeOptions = {}) {
  const raw = input.trim()

  if (!raw) {
    if (options.allowEmpty) {
      return ''
    }
    throw invalidContentKeyError()
  }

  let decoded: string
  try {
    decoded = decodeURIComponent(raw)
  }
  catch {
    throw invalidContentKeyError()
  }

  if (!decoded.trim()) {
    if (options.allowEmpty) {
      return ''
    }
    throw invalidContentKeyError()
  }

  if (decoded.startsWith('/') || decoded.startsWith('\\') || /^[a-z]:[\\/]/i.test(decoded)) {
    throw invalidContentKeyError()
  }

  const unifiedSeparators = decoded
    .replace(/[\\/]+/g, ':')
    .trim()

  if (!unifiedSeparators) {
    if (options.allowEmpty) {
      return ''
    }
    throw invalidContentKeyError()
  }

  if (hasControlCharacters(unifiedSeparators)) {
    throw invalidContentKeyError()
  }

  const segments = unifiedSeparators.split(':')

  if (segments.some(segment => !segment)) {
    throw invalidContentKeyError()
  }

  if (segments.some(segment => segment === '.' || segment === '..')) {
    throw invalidContentKeyError()
  }

  return segments.join(':')
}

export function normalizeContentKey(input: string) {
  return normalizeContentKeyInternal(input)
}

export function normalizeContentPrefix(input?: string) {
  if (!input) {
    return ''
  }

  return normalizeContentKeyInternal(input, { allowEmpty: true })
}
