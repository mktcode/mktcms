import { defineNuxtModule, addServerPlugin, createResolver } from '@nuxt/kit'
import defu from 'defu'

export default defineNuxtModule({
  meta: {
    name: 'mktcms',
    configKey: 'mktcms',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // S3
    _nuxt.options.runtimeConfig.mktcms = defu((_nuxt.options.runtimeConfig.mktcms, {
      s3AccessKey: '',
      s3SecretKey: '',
      s3Endpoint: '',
      s3Bucket: '',
      s3Region: '',
    }))

    addServerPlugin(resolver.resolve('./runtime/server/plugins/storage'))
  },
})
