import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

// Project
export interface ProjectsTable {
  id: Generated<number>
  name: string
  domain: string
  googleManagerId: string
}
export type Project = Selectable<ProjectsTable>
export type NewProject = Insertable<ProjectsTable>
export type ProjectUpdate = Updateable<ProjectsTable>

// Content
export interface ContentsTable {
  id: Generated<number>
  projectId: number
  title: string
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
  projectId: number
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
  projectId: number
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
  projectId: number
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

export interface Database {
  projects: ProjectsTable
  contents: ContentsTable
  categories: CategoriesTable
  contentCategories: ContentCategoriesTable
  stats: StatsTable
  businessinfo: BusinessinfoTable
}