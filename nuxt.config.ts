import tailwindcss from "@tailwindcss/vite";

const author = 'Beatrix Kopischke'
const title = 'Beatrix Kopischke - Inner Balance und Lifestyle Coaching Osnabrück'
const description = 'Yoga, Ernährung, Achtsamkeit und stilvolles Auftreten - Löse die Trennung zwischen Körper und Geist auf und finde über einen ganzheitlichen Ansatz zu mehr innerer Ruhe und Ausgeglichenheit.'
const keywords = 'Yoga, Ernährung, Achtsamkeit, Lifestyle, Coaching, Osnabrück'
const domain = 'https://fayo-coach.de'

export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    instagramAppId: process.env.INSTAGRAM_APP_ID,
    instagramAppSecret: process.env.INSTAGRAM_APP_SECRET,
  },
  app: {
    head: {
      title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
        { hid: 'author', name: 'author', content: author },
        { hid: 'keywords', name: 'keywords', content: keywords },
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:image', property: 'og:image', content: '/og-image.jpg' },
        { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
        { hid: 'og:image:height', property: 'og:image:height', content: '630' },
        { hid: 'og:url', property: 'og:url', content: domain },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { name: 'robots', content: 'noindex, nofollow' },
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/content'],
})
