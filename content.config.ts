import { defineContentConfig, defineCollection, z, defineCollectionSource } from '@nuxt/content'

const mktcmsSource = defineCollectionSource({
  getKeys: async () => {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const data = await res.json()
    return data.map((key: string) => `${key}.json`)
  },
  getItem: async (key: string) => {
    const id = key.split('.')[0]
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    const post = await res.json()
    const imgId = Math.floor(Math.random() * 2) + 1
    post.image = `/img/event${imgId}.jpg`
    post.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien.'
    post.date = new Date()
    return post
  },
})

const mktcms = defineCollection({
  type: 'data',
  source: mktcmsSource,
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    type: z.string(),
    score: z.number(),
    url: z.string(),
    by: z.string(),
    image: z.string(),
  }),
})

export default defineContentConfig({
  collections: {
    mktcms,
  }
})
