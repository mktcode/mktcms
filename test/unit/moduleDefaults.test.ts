import { describe, expect, it } from 'vitest'
import { applyMktcmsNuxtDefaults } from '../../src/moduleDefaults'

describe('applyMktcmsNuxtDefaults', () => {
  it('applies module defaults to empty Nuxt options', () => {
    const nuxtOptions: Record<string, any> = {}

    applyMktcmsNuxtDefaults(nuxtOptions)

    expect(nuxtOptions.router.options.scrollBehaviorType).toBe('smooth')
    expect(nuxtOptions.app.head.htmlAttrs.lang).toBe('de')
    expect(nuxtOptions.app.head.title).toBe('Neue Website')
    expect(nuxtOptions.app.head.meta).toContainEqual({
      name: 'description',
      content: 'Meine neue mktCMS Website',
    })
    expect(nuxtOptions.app.head.link).toContainEqual({
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    })
    expect(nuxtOptions.runtimeConfig.plausibleApiKey).toBe('')
    expect(nuxtOptions.runtimeConfig.public.plausibleApiHost).toBe('')
    expect(nuxtOptions.runtimeConfig.mktcms.frontmatter['Seiten/**/*.md'].seoTitle.label).toBe('SEO-Titel')
    expect(nuxtOptions.runtimeConfig.public.mktcms.showVersioning).toBe(false)
  })

  it('preserves explicit user config overrides', () => {
    const nuxtOptions: Record<string, any> = {
      app: {
        head: {
          title: 'Custom title',
          meta: [{ name: 'description', content: 'Custom description' }],
          link: [{ rel: 'icon', href: '/custom.ico' }],
        },
      },
      runtimeConfig: {
        mktcms: {
          frontmatter: {
            'Seiten/**/*.md': {
              seoTitle: {
                type: 'string',
                label: 'Custom SEO title',
              },
            },
          },
        },
      },
    }

    applyMktcmsNuxtDefaults(nuxtOptions, {
      frontmatter: {
        'Seiten/**/*.md': {
          teaser: {
            type: 'string',
            label: 'Teaser',
          },
        },
      },
    })

    expect(nuxtOptions.app.head.title).toBe('Custom title')
    expect(nuxtOptions.app.head.meta).toEqual([{ name: 'description', content: 'Custom description' }])
    expect(nuxtOptions.app.head.link).toEqual([{ rel: 'icon', href: '/custom.ico' }])
    expect(nuxtOptions.runtimeConfig.mktcms.frontmatter['Seiten/**/*.md'].seoTitle.label).toBe('Custom SEO title')
    expect(nuxtOptions.runtimeConfig.mktcms.frontmatter['Seiten/**/*.md'].teaser.label).toBe('Teaser')
  })
})