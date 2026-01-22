import z from 'zod'
import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'

const querySchema = z.object({
  path: z.string().optional(),
  type: z.enum(['image']).optional(),
})

export default defineEventHandler(async (event) => {
  const { path, type } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = path ? decodeURIComponent(path) : ''

  const pathPrefix = decodedPath ? decodedPath : ''
  const storage = useStorage('content')
  const keys = await storage.getKeys(pathPrefix)
  const keysWithoutPrefix = keys.map(key => key.replace(pathPrefix + ':', ''))

  const files = keysWithoutPrefix.filter((key: string) => !key.includes(':'))
  const filteredFiles = type === 'image'
    ? files.filter((file: string) => file.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i))
    : files

  const dirs = keysWithoutPrefix.filter((key: string) => key.includes(':')).map((key: string) => key.split(':')[0]!)
  const uniqueDirs = Array.from(new Set(dirs))

  return {
    files: filteredFiles,
    dirs: uniqueDirs,
  }
})
