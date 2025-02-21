import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';


// Content
export interface ContentsTable {
  id: Generated<number>
  title: string
  slug: string
  subtitle: string | null
  description: string | null
  date: ColumnType<string, string, string> | null
  url: string | null
  image: string | null
}
export type Content = Selectable<ContentsTable>
export type NewContent = Insertable<ContentsTable>
export type ContentUpdate = Updateable<ContentsTable>
export type ContentWithCategories = Content & {
  categories: Category[]
}

// Category
export interface CategoriesTable {
  id: Generated<number>
  name: string
  label: string
}
export type Category = Selectable<CategoriesTable>
export type NewCategory = Insertable<CategoriesTable>
export type CategoryUpdate = Updateable<CategoriesTable>

// ContentCategory
export interface ContentCategoriesTable {
  id: Generated<number>
  contentId: number
  categoryId: number
}
export type ContentCategory = Selectable<ContentCategoriesTable>
export type NewContentCategory = Insertable<ContentCategoriesTable>

// Stats
export interface StatsTable {
  id: Generated<number>
  userId: string
  route: string
  referer: string | null
  isMobile: number
  timestamp: ColumnType<Date, never, never>
}
export type Stat = Selectable<StatsTable>
export type NewStat = Insertable<StatsTable>

// Businessinfo
export interface BusinessinfoTable {
  id: Generated<number>
  name: string
  street: string
  city: string
  zip: string
  phone: string
  email: string
  taxId: string
}
export type Businessinfo = Selectable<BusinessinfoTable>
export type NewBusinessinfo = Insertable<BusinessinfoTable>
export type BusinessinfoUpdate = Updateable<BusinessinfoTable>

// Theme
export interface ThemeTable {
  id: Generated<number>
  primaryColor: string
  primaryColorHover: string
}
export type Theme = Selectable<ThemeTable>
export type NewTheme = Insertable<ThemeTable>
export type ThemeUpdate = Updateable<ThemeTable>

// Section
export interface SectionsTable {
  id: Generated<number>
  name: string
  component: string
  contentId: number
  categoryId: number
  orderIndex: number
}
export type Section = Selectable<SectionsTable>
export type NewSection = Insertable<SectionsTable>
export type SectionUpdate = Updateable<SectionsTable>

export interface Database {
  contents: ContentsTable
  categories: CategoriesTable
  contentCategories: ContentCategoriesTable
  stats: StatsTable
  businessinfo: BusinessinfoTable
  theme: ThemeTable
  sections: SectionsTable
}