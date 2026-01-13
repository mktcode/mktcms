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
      filesPathPrefix: '',
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
      handler: resolver.resolve('./runtime/server/middleware/auth'),
    })

    // Admin API Routes
    addServerHandler({
      route: '/api/admin/login',
      handler: resolver.resolve('./runtime/server/api/admin/login'),
    })
    addServerHandler({
      route: '/api/admin/logout',
      handler: resolver.resolve('./runtime/server/api/admin/logout'),
    })
    addServerHandler({
      route: '/api/admin/content/upload',
      handler: resolver.resolve('./runtime/server/api/admin/content/upload'),
    })
    addServerHandler({
      route: '/api/content/list',
      handler: resolver.resolve('./runtime/server/api/content/list'),
    })
    addServerHandler({
      route: '/api/content/:path',
      handler: resolver.resolve('./runtime/server/api/content/[path]'),
    })

    // Admin Pages
    extendPages((pages) => {
      pages.push({
        name: 'Admin Dashboard',
        path: '/admin/:path?',
        file: resolver.resolve('./runtime/app/pages/admin/index.vue'),
      })

      pages.push({
        name: 'Admin Editor',
        path: '/admin/edit/:path',
        file: resolver.resolve('./runtime/app/pages/admin/edit/[path].vue'),
      })

      pages.push({
        name: 'Admin Login',
        path: '/admin/login',
        file: resolver.resolve('./runtime/app/pages/admin/login.vue'),
      })
    })
  },
})
