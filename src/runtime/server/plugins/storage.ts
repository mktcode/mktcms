import createS3Driver from 'unstorage/drivers/s3'
import createFsDriver from 'unstorage/drivers/fs'
import { useRuntimeConfig } from '#imports'
import { defineNitroPlugin, useStorage } from '#build/types/nitro-imports'

export default defineNitroPlugin(() => {
  const storage = useStorage()

  const s3Driver = createS3Driver({
    accessKeyId: useRuntimeConfig().mktcms.s3AccessKey,
    secretAccessKey: useRuntimeConfig().mktcms.s3SecretKey,
    endpoint: "https://nbg1.your-objectstorage.com",
    bucket: "mktcode-websites",
    region: "eu-central",
  })

  const fsDriver = createFsDriver({
    base: './.storage',
  })

  if (process.env.NODE_ENV === 'production') {
    storage.mount('content', s3Driver)
  } else {
    storage.mount('content', fsDriver)
  }
})