import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface ContentTable {
  id: Generated<number>
  category: string
  title: string
  description: string
  date: ColumnType<string, string, string> | null
  url: string
  image: string | null
}

export type Content = Selectable<ContentTable>
export type NewContent = Insertable<ContentTable>
export type ContentUpdate = Updateable<ContentTable>

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

export interface Database {
  content: ContentTable
  stats: StatsTable
}