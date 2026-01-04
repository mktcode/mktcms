import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const categoryTable = sqliteTable('categories', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull(),
  createdAt: text().notNull(),
  updatedAt: text().notNull(),
})

export const contentTable = sqliteTable('content', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  slug: text().notNull(),
  body: text().notNull(),
  date: text(),
  createdAt: text().notNull(),
  updatedAt: text().notNull(),
})

export const contentCategoryTable = sqliteTable('content_categories', {
  contentId: int()
    .notNull()
    .references(() => contentTable.id, { onDelete: 'cascade' }),
  categoryId: int()
    .notNull()
    .references(() => categoryTable.id, { onDelete: 'cascade' }),
})
