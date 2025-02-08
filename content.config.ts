import { defineContentConfig, defineCollection, z, defineCollectionSource } from '@nuxt/content'

const mktcmsSource = defineCollectionSource({
  getKeys: () => {
    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(res => res.json())
      .then(data => data.map((key: string) => `${key}.json`))
  },
  getItem: (key: string) => {
    const id = key.split('.')[0]
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(res => res.json())
  },
})

const mktcms = defineCollection({
  type: 'data',
  source: mktcmsSource,
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.string(),
    score: z.number(),
    url: z.string(),
    by: z.string(),
  }),
})

export default defineContentConfig({
  collections: {
    mktcms,
  }
})
