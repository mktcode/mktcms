import defu from 'defu'

type AnyRecord = Record<string, any>

export interface MktcmsModuleOptions {
  frontmatter?: Record<string, any>
}

const DEFAULT_HEAD_META = [
  {
    name: 'description',
    content: 'Meine neue mktCMS Website',
  },
]

const DEFAULT_HEAD_LINK = [
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon.png',
  },
]

export const defaultFrontmatterSchema = {
  seoTitle: {
    type: 'string',
    label: 'SEO-Titel',
  },
}

export const defaultFrontmatterSchemas = {
  'Seiten/Startseite.md': defaultFrontmatterSchema,
  'Seiten/**/*.md': defaultFrontmatterSchema,
}

function mergeHeadMeta(meta: AnyRecord[] | undefined) {
  const nextMeta = Array.isArray(meta) ? [...meta] : []

  for (const defaultMeta of DEFAULT_HEAD_META) {
    const hasMatch = nextMeta.some(item => item?.name === defaultMeta.name)

    if (!hasMatch) {
      nextMeta.push(defaultMeta)
    }
  }

  return nextMeta
}

function mergeHeadLinks(links: AnyRecord[] | undefined) {
  const nextLinks = Array.isArray(links) ? [...links] : []

  for (const defaultLink of DEFAULT_HEAD_LINK) {
    const hasMatch = nextLinks.some(item => item?.rel === defaultLink.rel)

    if (!hasMatch) {
      nextLinks.push(defaultLink)
    }
  }

  return nextLinks
}

export function applyMktcmsNuxtDefaults(nuxtOptions: AnyRecord, moduleOptions: MktcmsModuleOptions = {}) {
  nuxtOptions.router = defu(nuxtOptions.router, {
    options: {
      scrollBehaviorType: 'smooth',
    },
  })

  nuxtOptions.app = defu(nuxtOptions.app, {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      title: 'Neue Website',
    },
  })

  nuxtOptions.app.head = nuxtOptions.app.head || {}
  nuxtOptions.app.head.meta = mergeHeadMeta(nuxtOptions.app.head.meta)
  nuxtOptions.app.head.link = mergeHeadLinks(nuxtOptions.app.head.link)

  nuxtOptions.runtimeConfig = defu(nuxtOptions.runtimeConfig, {
    plausibleApiKey: '',
  })
  nuxtOptions.runtimeConfig.public = defu(nuxtOptions.runtimeConfig.public, {
    plausibleApiHost: '',
  })

  nuxtOptions.runtimeConfig.mktcms = defu(nuxtOptions.runtimeConfig.mktcms, {
    adminAuthKey: '',
    authCookieMaxAgeSeconds: 7 * 24 * 60 * 60,
    authCookiePath: '/',
    authCookieSameSite: 'lax',
    authCookieSecure: process.env.NODE_ENV === 'production',
    loginRateLimitMaxAttempts: 5,
    loginRateLimitWindowSeconds: 300,
    loginRateLimitBlockSeconds: 600,
    uploadMaxBytes: 50 * 1024 * 1024,
    openaiApiKey: '',
    openaiModel: 'gpt-5.4-mini',
    smtpHost: '',
    smtpPort: 465,
    smtpSecure: true,
    smtpUser: '',
    smtpPass: '',
    mailerFrom: '',
    mailerTo: '',
    gitUser: '',
    gitRepo: '',
    gitToken: '',
    frontmatter: defu(moduleOptions.frontmatter || {}, defaultFrontmatterSchemas),
  })

  nuxtOptions.runtimeConfig.public.mktcms = defu(nuxtOptions.runtimeConfig.public.mktcms, {
    siteUrl: '',
    showVersioning: false,
  })
}