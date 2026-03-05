export default defineNuxtConfig({
  modules: ['../src/module', '@nuxtjs/mdc'],
  devtools: { enabled: true },
  css: ['./playground/app/assets/css/main.css'],
  mktcms: {
    frontmatter: {
      '**/*.md': {
        seoTitle: { type: 'string', label: 'SEO Titel' },
        dateUntil: { type: 'date', label: 'Datum bis' },
        createdAt: { type: 'datetime', label: 'Erstellt am' },
        isActive: { type: 'boolean', label: 'Aktiv' },
        tags: { type: 'array', label: 'Tags', items: { type: 'string' } },
        pdfDownload: { type: 'string', label: 'PDF Download', 'x-ui': 'pdf' },
        someFile: { type: 'string', label: 'Irgendeine Datei', 'x-ui': 'file' },
        gallery: {
          type: 'array',
          label: 'Galerie',
          items: {
            type: 'object',
            properties: {
              src: { type: 'string', label: 'Bild', 'x-ui': 'image' },
              caption: { type: 'string', label: 'Bildunterschrift' },
            }
          }
        },
      }
    },
  },
})
