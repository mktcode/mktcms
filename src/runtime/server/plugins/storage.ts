import createS3Driver from 'unstorage/drivers/s3'
import createFsDriver from 'unstorage/drivers/fs'
import { defineNitroPlugin, useStorage, useRuntimeConfig } from 'nitropack/runtime'

export default defineNitroPlugin(() => {
  const storage = useStorage()

  const { mktcms: { s3AccessKey, s3SecretKey, s3Endpoint, s3Bucket, s3Region } } = useRuntimeConfig()

  if (s3AccessKey && s3SecretKey && s3Endpoint && s3Bucket && s3Region) {
    storage.mount('content', createS3Driver({
      accessKeyId: s3AccessKey,
      secretAccessKey: s3SecretKey,
      endpoint: s3Endpoint,
      bucket: s3Bucket,
      region: s3Region,
    }))
  } else {
    storage.mount('content', createFsDriver({
      base: './.storage',
    }))
  }

  storage.mount('fallback', createFsDriver({
    base: './content',
  }))
})
