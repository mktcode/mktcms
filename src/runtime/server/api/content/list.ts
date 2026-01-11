import { useStorage, useRuntimeConfig } from 'nitropack/runtime'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const { mktcms: { filesPathPrefix } } = useRuntimeConfig()

  const storage = useStorage('content')
  const keys = await storage.getKeys(filesPathPrefix + '/')

  return keys
})