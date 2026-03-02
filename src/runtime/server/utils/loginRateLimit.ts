import type { H3Event } from 'h3'
import { createError, getRequestIP } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

type AttemptState = {
  failedAt: number[]
  blockedUntil: number
}

const attempts = new Map<string, AttemptState>()

function getState(clientId: string) {
  const state = attempts.get(clientId)
  if (state) {
    return state
  }

  const next: AttemptState = {
    failedAt: [],
    blockedUntil: 0,
  }
  attempts.set(clientId, next)
  return next
}

function getClientId(event: H3Event) {
  const forwarded = getRequestIP(event, { xForwardedFor: true })
  return forwarded || event.node.req.socket.remoteAddress || 'unknown'
}

function getRateLimitSettings(event: H3Event) {
  const {
    mktcms: {
      loginRateLimitMaxAttempts,
      loginRateLimitWindowSeconds,
      loginRateLimitBlockSeconds,
    },
  } = useRuntimeConfig(event)

  const maxAttempts = Math.max(1, Number(loginRateLimitMaxAttempts) || 5)
  const windowMs = Math.max(1, Number(loginRateLimitWindowSeconds) || 300) * 1000
  const blockMs = Math.max(1, Number(loginRateLimitBlockSeconds) || 600) * 1000

  return {
    maxAttempts,
    windowMs,
    blockMs,
  }
}

function clearStaleAttempts(state: AttemptState, now: number, windowMs: number) {
  state.failedAt = state.failedAt.filter(ts => now - ts <= windowMs)
}

export function assertLoginNotRateLimited(event: H3Event) {
  const { windowMs } = getRateLimitSettings(event)
  const clientId = getClientId(event)
  const now = Date.now()
  const state = getState(clientId)

  clearStaleAttempts(state, now, windowMs)

  if (state.blockedUntil > now) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Please try again later.',
    })
  }
}

export function recordFailedLoginAttempt(event: H3Event) {
  const { maxAttempts, windowMs, blockMs } = getRateLimitSettings(event)
  const clientId = getClientId(event)
  const now = Date.now()
  const state = getState(clientId)

  clearStaleAttempts(state, now, windowMs)
  state.failedAt.push(now)

  if (state.failedAt.length >= maxAttempts) {
    state.blockedUntil = now + blockMs
    state.failedAt = []
  }
}

export function clearFailedLoginAttempts(event: H3Event) {
  const clientId = getClientId(event)
  attempts.delete(clientId)
}
