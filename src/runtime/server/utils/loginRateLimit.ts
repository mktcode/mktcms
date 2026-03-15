import type { H3Event } from 'h3'
import { createError, getRequestIP } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

type AttemptState = {
  failedAt: number[]
  blockedUntil: number
  lastSeenAt: number
}

const attempts = new Map<string, AttemptState>()

const SWEEP_EVERY_ACCESSES = 64
const INACTIVE_GRACE_MS = 60 * 60 * 1000
const MAX_TRACKED_CLIENTS = 10_000

let accessCount = 0

function isInactiveState(state: AttemptState, now: number) {
  return state.blockedUntil <= now && now - state.lastSeenAt > INACTIVE_GRACE_MS
}

function evictInactiveClients(now: number) {
  const toDelete: string[] = []
  attempts.forEach((state, clientId) => {
    if (isInactiveState(state, now)) {
      toDelete.push(clientId)
    }
  })

  for (const clientId of toDelete) {
    attempts.delete(clientId)
  }
}

function enforceTrackedClientsCap() {
  // Map preserves insertion order, so this behaves like a simple LRU trim.
  while (attempts.size > MAX_TRACKED_CLIENTS) {
    let oldestClientId: string | undefined
    attempts.forEach((_state, clientId) => {
      if (!oldestClientId) {
        oldestClientId = clientId
      }
    })
    if (!oldestClientId) {
      return
    }
    attempts.delete(oldestClientId)
  }
}

function maybeSweep(now: number) {
  accessCount += 1
  if (accessCount % SWEEP_EVERY_ACCESSES !== 0) {
    return
  }

  evictInactiveClients(now)
  enforceTrackedClientsCap()
}

function getState(clientId: string, now: number) {
  const state = attempts.get(clientId)
  if (state) {
    state.lastSeenAt = now
    // Refresh insertion order so active clients are less likely to be evicted.
    attempts.delete(clientId)
    attempts.set(clientId, state)
    return state
  }

  const next: AttemptState = {
    failedAt: [],
    blockedUntil: 0,
    lastSeenAt: now,
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
  maybeSweep(now)
  const state = getState(clientId, now)

  clearStaleAttempts(state, now, windowMs)

  if (state.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((state.blockedUntil - now) / 1000)

    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Please try again later.',
      data: {
        retryAfterSeconds,
      },
    })
  }
}

export function recordFailedLoginAttempt(event: H3Event) {
  const { maxAttempts, windowMs, blockMs } = getRateLimitSettings(event)
  const clientId = getClientId(event)
  const now = Date.now()
  maybeSweep(now)
  const state = getState(clientId, now)

  clearStaleAttempts(state, now, windowMs)
  state.failedAt.push(now)

  if (state.failedAt.length >= maxAttempts) {
    state.blockedUntil = now + blockMs
    state.failedAt = []
  }
}

export function clearFailedLoginAttempts(event: H3Event) {
  const now = Date.now()
  maybeSweep(now)
  const clientId = getClientId(event)
  attempts.delete(clientId)
}
