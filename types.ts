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
  password: string
  isOnline: boolean
}
export type Project = Selectable<ProjectsTable>
export type NewProject = Insertable<ProjectsTable>
export type ProjectUpdate = Updateable<ProjectsTable>

// Project Info
export interface ProjectInfoTable {
  id: number
  projectId: number
  logo: string | null
  phone: string | null
  email: string | null
  title: string
  subtitle: string | null
  slogan: string | null
  description: string | null
  ctaType: number
}

// Content
export interface ContentsTable {
  id: Generated<number>
  projectId: number
  parentId: number | null
  title: string
  subtitle: string | null
  description: string | null
  date: ColumnType<string, string, string> | null
  url: string | null
  image: string | null
  orderIndex: number
}
export type Content = Selectable<ContentsTable>
export type NewContent = Insertable<ContentsTable>
export type ContentUpdate = Updateable<ContentsTable>

export interface Database {
  projects: ProjectsTable
  contents: ContentsTable
}