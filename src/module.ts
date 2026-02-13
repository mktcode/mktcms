import { defineNuxtModule, addServerPlugin, createResolver, addServerHandler, extendPages, addServerImports, addImports, addComponent } from '@nuxt/kit'
import defu from 'defu'

export default defineNuxtModule({
  meta: {
    name: 'mktcms',
    configKey: 'mktcms',
  },
  moduleDependencies: {
    '@nuxtjs/mdc': {
      version: '^0.20.0',
    },
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // Runtime Config
    _nuxt.options.runtimeConfig.mktcms = defu((_nuxt.options.runtimeConfig.mktcms, {
      adminAuthKey: '',
      smtpHost: '',
      smtpPort: 465,
      smtpSecure: true,
      smtpUser: '',
      smtpPass: '',
      mailerFrom: '',
      mailerTo: '',
    }))

    _nuxt.options.runtimeConfig.public.mktcms = defu((_nuxt.options.runtimeConfig.public.mktcms, {
      siteUrl: '',
    }))

    // Add frontend components
    addComponent({
      name: 'AdminWidget',
      filePath: resolver.resolve('runtime/app/components/frontend/widget.vue'),
    })

    // Add frontend composables
    addImports([
      {
        name: 'useSiteUrl',
        as: 'useSiteUrl',
        from: resolver.resolve('runtime/app/composables/useSiteUrl'),
      }, {
        name: 'useMdContent',
        as: 'useMdContent',
        from: resolver.resolve('runtime/app/composables/useMdContent'),
      }, {
        name: 'useMdContents',
        as: 'useMdContents',
        from: resolver.resolve('runtime/app/composables/useMdContents'),
      }, {
        name: 'useCsvContent',
        as: 'useCsvContent',
        from: resolver.resolve('runtime/app/composables/useCsvContent'),
      }, {
        name: 'useTxtContent',
        as: 'useTxtContent',
        from: resolver.resolve('runtime/app/composables/useTxtContent'),
      }, {
        name: 'useTxtContents',
        as: 'useTxtContents',
        from: resolver.resolve('runtime/app/composables/useTxtContents'),
      }, {
        name: 'useImagePaths',
        as: 'useImagePaths',
        from: resolver.resolve('runtime/app/composables/useImagePaths'),
      }, {
        name: 'useForm',
        as: 'useForm',
        from: resolver.resolve('runtime/app/composables/useForm'),
      },
    ])

    // Add server utils (avoid scanning directories that may contain generated .d.ts files)
    addServerImports({
      name: 'sendMail',
      from: resolver.resolve('runtime/server/utils/sendMail'),
    })

    // Storage Plugin
    addServerPlugin(resolver.resolve('./runtime/server/plugins/storage'))

    // Auth Middleware
    addServerHandler({
      middleware: true,
      handler: resolver.resolve('./runtime/server/middleware/auth'),
    })

    /*
     * Admin API Routes
     */

    // Auth
    addServerHandler({
      route: '/api/admin/login',
      handler: resolver.resolve('./runtime/server/api/admin/login'),
    })
    addServerHandler({
      route: '/api/admin/logout',
      handler: resolver.resolve('./runtime/server/api/admin/logout'),
    })

    // List
    addServerHandler({
      route: '/api/admin/list',
      handler: resolver.resolve('./runtime/server/api/admin/list'),
    })
    // Delete
    addServerHandler({
      route: '/api/admin/delete',
      method: 'delete',
      handler: resolver.resolve('./runtime/server/api/admin/delete'),
    })

    // CSV
    addServerHandler({
      route: '/api/admin/csv',
      handler: resolver.resolve('./runtime/server/api/admin/csv'),
    })
    addServerHandler({
      route: '/api/admin/csv',
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/admin/csv.post'),
    })

    // Markdown
    addServerHandler({
      route: '/api/admin/md',
      handler: resolver.resolve('./runtime/server/api/admin/md'),
    })
    addServerHandler({
      route: '/api/admin/md',
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/admin/md.post'),
    })

    // Txt
    addServerHandler({
      route: '/api/admin/txt',
      handler: resolver.resolve('./runtime/server/api/admin/txt'),
    })
    addServerHandler({
      route: '/api/admin/txt',
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/admin/txt.post'),
    })

    // Image
    addServerHandler({
      route: '/api/admin/image',
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/admin/image.post'),
    })

    // Blob
    addServerHandler({
      route: '/api/admin/blob',
      handler: resolver.resolve('./runtime/server/api/admin/blob'),
    })

    // Import
    addServerHandler({
      route: '/api/admin/import',
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/admin/import'),
    })
    // Upload
    addServerHandler({
      route: '/api/admin/upload',
      handler: resolver.resolve('./runtime/server/api/admin/upload'),
    })
    // Download
    addServerHandler({
      route: '/api/admin/download',
      handler: resolver.resolve('./runtime/server/api/admin/download'),
    })

    // Storage usage
    addServerHandler({
      route: '/api/admin/storage-usage',
      handler: resolver.resolve('./runtime/server/api/admin/storage-usage'),
    })

    // Stats
    addServerHandler({
      route: '/api/admin/stats-visits',
      handler: resolver.resolve('./runtime/server/api/admin/stats-visits'),
    })

    // Public API Routes
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
        name: 'Admin Editor',
        path: '/admin/edit/markdown/:path',
        file: resolver.resolve('./runtime/app/pages/admin/edit/markdown/[path].vue'),
      })

      pages.push({
        name: 'Admin Delete',
        path: '/admin/delete/:path',
        file: resolver.resolve('./runtime/app/pages/admin/delete/[path].vue'),
      })

      pages.push({
        name: 'Admin New Content',
        path: '/admin/new',
        file: resolver.resolve('./runtime/app/pages/admin/new.vue'),
      })

      pages.push({
        name: 'Admin Login',
        path: '/admin/login',
        file: resolver.resolve('./runtime/app/pages/admin/login.vue'),
      })
    })
  },
})
