import createFsDriver from 'unstorage/drivers/fs'
import { defineNitroPlugin, useStorage } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  const storage = useStorage()

  storage.mount('content', createFsDriver({
    base: './.storage',
  }))
})
