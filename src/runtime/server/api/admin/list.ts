import z from 'zod'
import { useStorage } from 'nitropack/runtime'
import { defineEventHandler, getValidatedQuery } from 'h3'

const querySchema = z.object({
  path: z.string().optional(),
  type: z.enum(['image']).optional(),
})

export default defineEventHandler(async (event) => {
  const { path, type } = await getValidatedQuery(event, query => querySchema.parse(query))
  const decodedPath = path ? decodeURIComponent(path) : ''

  const storage = useStorage('content')
  const keys = await storage.getKeys(decodedPath)
  const keysWithoutPath = decodedPath ? keys.map(key => key.replace(decodedPath + ':', '')) : keys

  const files = keysWithoutPath.filter((key: string) => !key.includes(':'))
  const filteredFiles = type === 'image'
    ? files.filter((file: string) => file.match(/\.(png|jpg|jpeg|gif|webp)$/i))
    : files

  const dirs = keysWithoutPath.filter((key: string) => key.includes(':')).map((key: string) => key.split(':')[0]!)
  const uniqueDirs = Array.from(new Set(dirs))

  return {
    files: filteredFiles,
    dirs: uniqueDirs,
  }
})
