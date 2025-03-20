export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
    smtpFromName: process.env.SMTP_FROM_NAME,
    smtpTo: process.env.SMTP_TO,
    ipHashSalt: process.env.IP_HASH_SALT,
    openaiApiKey: process.env.OPENAI_API_KEY,
    oauth: {
      google: {
        clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirectURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
      },
    },
    session: {
      password: process.env.SESSION_PASSWORD || '',
    },
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    }
  },
  app: {
    head: {
      title: "Mkt's CMS",
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.png', type: 'image/png' },
      ],
    }
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  modules: [
    'nuxt-auth-utils',
    'nuxt-authorization',
    '@nuxt/ui',
  ],
  ui: {
    colorMode: false,
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  }
})
