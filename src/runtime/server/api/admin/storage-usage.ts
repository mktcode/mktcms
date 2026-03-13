import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createError, defineEventHandler } from 'h3'

const execFileAsync = promisify(execFile)

const CACHE_TTL_MS = 900_000
let cachedBytes: { value: number, at: number } | null = null
let inFlight: Promise<number> | null = null

export default defineEventHandler(async () => {
  try {
    const now = Date.now()
    if (cachedBytes && (now - cachedBytes.at) < CACHE_TTL_MS) {
      return { bytes: cachedBytes.value }
    }

    const storageDir = resolve(process.cwd(), '.storage')

    try {
      await access(storageDir)
    }
    catch {
      cachedBytes = { value: 0, at: now }
      return { bytes: 0 }
    }

    try {
      if (!inFlight) {
        inFlight = (async () => {
          // GNU coreutils: "<bytes>\t<path>\n"
          const { stdout } = await execFileAsync('du', ['-sb', storageDir], {
            timeout: 15_000,
            maxBuffer: 1024 * 1024,
          })

          const bytesString = stdout.trim().split(/\s+/)[0]
          const bytes = Number.parseInt(bytesString || '', 10)
          if (!Number.isFinite(bytes) || bytes < 0) {
            throw new Error('Unexpected du output')
          }

          return bytes
        })()
      }

      const bytes = await inFlight
      cachedBytes = { value: bytes, at: Date.now() }
      return { bytes }
    }
    catch {
      // If anything goes wrong (including an unexpected inFlight failure), drop cache state.
      inFlight = null
      throw new Error('Failed to calculate storage usage')
    }
    finally {
      inFlight = null
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to calculate storage usage',
    })
  }
})
