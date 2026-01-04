import { defineNuxtModule, createResolver, extendPages, addImportsDir, addComponent, addServerHandler } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  s3Bucket?: string
  s3AccessKeyId?: string
  s3SecretAccessKey?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'mktcms',
    configKey: 'mktcms',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, nuxt) {
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      storage: {
        mktcmsUploads: {
          driver: 'fs',
          base: './.mktcms/uploads/',
        },
      },
    })

    nuxt.options.runtimeConfig.mktcms = {
      authKey: process.env.MKTCMS_AUTH_KEY || '',
    }

    const resolver = createResolver(import.meta.url)

    // Auth middleware
    addServerHandler({
      middleware: true,
      handler: resolver.resolve('./runtime/server/middleware/auth'),
    })

    // API routes
    addServerHandler({
      route: '/api/admin/login',
      handler: resolver.resolve('./runtime/server/api/admin/login'),
    })
    addServerHandler({
      route: '/api/admin/content/add',
      handler: resolver.resolve('./runtime/server/api/admin/content/add.post'),
    })
    addServerHandler({
      route: '/api/admin/categories/list',
      handler: resolver.resolve('./runtime/server/api/admin/categories/list'),
    })
    addServerHandler({
      route: '/api/admin/files',
      handler: resolver.resolve('./runtime/server/api/admin/files/index'),
    })
    addServerHandler({
      route: '/api/content/:slug',
      handler: resolver.resolve('./runtime/server/api/content/[slug]'),
    })
    addServerHandler({
      route: '/api/content',
      handler: resolver.resolve('./runtime/server/api/content/index'),
    })

    // Components
    addComponent({
      name: 'MktcmsLogin',
      filePath: resolver.resolve('runtime/app/components/Login.vue'),
    })
    addComponent({
      name: 'MktcmsCategories',
      filePath: resolver.resolve('runtime/app/components/Categories.vue'),
    })

    // Composables
    addImportsDir(resolver.resolve('runtime/app/composables'))

    // Pages
    extendPages((pages) => {
      pages.push({
        name: 'Admin',
        path: '/admin',
        file: resolver.resolve('./runtime/app/pages/admin/index.vue'),
      })
    })

    extendPages((pages) => {
      pages.push({
        name: 'Login',
        path: '/admin/login',
        file: resolver.resolve('./runtime/app/pages/admin/login.vue'),
      })
    })
  },
})
