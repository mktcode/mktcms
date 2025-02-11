import type { RowDataPacket } from "mysql2"

export interface Post extends RowDataPacket {
  id: number
  title: string
  description: string
  date: string
  url: string
}