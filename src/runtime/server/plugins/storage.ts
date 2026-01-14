import createS3Driver from 'unstorage/drivers/s3'
import createFsDriver from 'unstorage/drivers/fs'
import { defineNitroPlugin, useStorage, useRuntimeConfig } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  const storage = useStorage()

  const s3Driver = createS3Driver({
    accessKeyId: useRuntimeConfig().mktcms.s3AccessKey,
    secretAccessKey: useRuntimeConfig().mktcms.s3SecretKey,
    endpoint: useRuntimeConfig().mktcms.s3Endpoint,
    bucket: useRuntimeConfig().mktcms.s3Bucket,
    region: useRuntimeConfig().mktcms.s3Region,
  })

  const fsDriver = createFsDriver({
    base: './.storage',
  })

  const fallbackDriver = createFsDriver({
    base: './content',
  })

  storage.mount('fallback', fallbackDriver)

  if (process.env.NODE_ENV === 'production') {
    storage.mount('content', s3Driver)
  }
  else {
    storage.mount('content', fsDriver)
  }
})
