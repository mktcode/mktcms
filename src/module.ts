import { defineNuxtModule, addServerPlugin, createResolver, addServerHandler, extendPages } from '@nuxt/kit'
import defu from 'defu'

export default defineNuxtModule({
  meta: {
    name: 'mktcms',
    configKey: 'mktcms',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // Runtime Config
    _nuxt.options.runtimeConfig.mktcms = defu((_nuxt.options.runtimeConfig.mktcms, {
      adminAuthKey: '',
      s3AccessKey: '',
      s3SecretKey: '',
      s3Endpoint: '',
      s3Bucket: '',
      s3Region: '',
    }))

    // S3 Storage Plugin
    addServerPlugin(resolver.resolve('./runtime/server/plugins/storage'))

    // Auth Middleware
    addServerHandler({
      middleware: true,
      handler: resolver.resolve('./runtime/server/middleware/auth')
    })

    // Admin API Routes
    addServerHandler({
      route: '/api/admin/login',
      handler: resolver.resolve('./runtime/server/api/admin/login')
    })

    // Admin Pages
    extendPages((pages) => {
      pages.push({
        name: 'Admin Dashboard',
        path: '/admin',
        file: resolver.resolve('./runtime/app/pages/admin/index.vue'),
      })

      pages.push({
        name: 'Admin Login',
        path: '/admin/login',
        file: resolver.resolve('./runtime/app/pages/admin/login.vue'),
      })
    })
  },
})
