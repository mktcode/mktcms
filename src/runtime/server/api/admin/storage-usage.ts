import { access, readdir, lstat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createError, defineEventHandler } from 'h3'

const execFileAsync = promisify(execFile)

const CACHE_TTL_MS = 60_000
let cachedBytes: { value: number, at: number } | null = null
let inFlight: Promise<number> | null = null

async function getDirectorySizeBytes(dirPath: string): Promise<number> {
  // Iterative traversal to avoid deep recursion.
  const dirsToVisit: string[] = [dirPath]
  let totalBytes = 0

  while (dirsToVisit.length > 0) {
    const currentDir = dirsToVisit.pop()!

    let entries
    try {
      entries = await readdir(currentDir, { withFileTypes: true })
    }
    catch (error: any) {
      // If the dir doesn't exist, treat it as empty.
      if (error?.code === 'ENOENT') {
        continue
      }
      throw error
    }

    for (const entry of entries) {
      const entryPath = resolve(currentDir, entry.name)

      let stats
      try {
        stats = await lstat(entryPath)
      }
      catch (error: any) {
        // If a file disappears between readdir and stat, ignore it.
        if (error?.code === 'ENOENT') {
          continue
        }
        throw error
      }

      if (stats.isDirectory()) {
        dirsToVisit.push(entryPath)
        continue
      }

      // For symlinks and regular files, we count the lstat size.
      totalBytes += stats.size
    }
  }

  return totalBytes
}

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
          // On Linux, `du` is typically significantly faster than per-file `lstat()` in JS.
          // We keep a JS fallback for environments where `du` is missing or incompatible.
          try {
            const { stdout } = await execFileAsync('du', ['-sb', storageDir], {
              timeout: 15_000,
              maxBuffer: 1024 * 1024,
            })

            // GNU coreutils: "<bytes>\t<path>\n"
            const bytesString = stdout.trim().split(/\s+/)[0]
            const bytes = Number.parseInt(bytesString || '', 10)
            if (!Number.isFinite(bytes) || bytes < 0) {
              throw new Error('Unexpected du output')
            }

            return bytes
          }
          catch {
            return await getDirectorySizeBytes(storageDir)
          }
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
