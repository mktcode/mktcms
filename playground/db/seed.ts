import db from './'
import { categoryTable, contentTable, contentCategoryTable } from './schema'

const category = await db.insert(categoryTable).values({
  name: 'Beiträge',
  slug: 'beitraege',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const content = await db.insert(contentTable).values({
  title: 'Erster Beitrag',
  slug: 'erster-beitrag',
  body: 'Das ist der Inhalt des ersten Beitrags.',
  date: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

await db.insert(contentCategoryTable).values({
  contentId: Number(content.lastInsertRowid),
  categoryId: Number(category.lastInsertRowid),
})
