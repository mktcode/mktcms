import { defineContentConfig, defineCollection, z, defineCollectionSource } from '@nuxt/content'
import { getDatabaseConnection } from './server/utils/db'
import type { RowDataPacket } from 'mysql2'

interface Content extends RowDataPacket {
  id: number
  title: string
  description: string
  date: string
  url: string
}

const mktcmsSource = defineCollectionSource({
  getKeys: async () => {
    const db = await getDatabaseConnection()
    const [ids] = await db.query<Content[]>('SELECT id FROM content')
    const keys = ids.map(({ id }) => `${id.toString()}.json`)
    return keys
  },
  getItem: async (key: string) => {
    const db = await getDatabaseConnection()
    const [content] = await db.query<Content[]>('SELECT id, title, description, date, url FROM content WHERE id = ?', [key])
    const post = content[0] as any;
    const imgId = Math.floor(Math.random() * 2) + 1
    post.image = `/img/event${imgId}.jpg`

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
    url: z.string(),
    image: z.string(),
  }),
})

export default defineContentConfig({
  collections: {
    mktcms,
  }
})
