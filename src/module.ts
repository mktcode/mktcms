import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import defu from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'mktcms',
    configKey: 'mktcms',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // S3
    _nuxt.options.runtimeConfig.mktcms = defu((_nuxt.options.runtimeConfig.mktcms, {
      s3AccessKey: '',
      s3SecretKey: '',
    }))

    addPlugin(resolver.resolve('./runtime/server/plugins/storage'))
  },
})
